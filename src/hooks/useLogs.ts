import { BATTLE_EVENT, DEFEND_EVENT, FORTIFY_EVENT, SUPPLY_EVENT } from '@/constants';
import { useDojo } from '@/dojo/useDojo';
import { fetchEventsOnce } from '@/services/fetchEvents';
import {
  Event,
  createBattleLog,
  createDefendLog,
  createFortifyLog,
  createSupplyLog,
  parseBattleEvent,
  parseDefendEvent,
  parseFortifyEvent,
  parseSupplyEvent,
} from '@/utils/events';
import { useElementStore } from '@/utils/store';
import { Battle, BattleEvent } from '@/utils/types';
import { useEffect, useRef, useState } from 'react';
import { Subscription, filter, mergeMap } from 'rxjs';
import { useGetPlayers } from './useGetPlayers';
import { getBattleFromBattleEvents } from '@/utils/battle';

export enum EventType {
  Supply,
  Defend,
  Fortify,
}

export type LogType = {
  key: string;
  timestamp: number;
  log: string[];
  regionFrom?: number;
  regionTo?: number;
  battle?: Battle;
  type: EventType;
};

const generateLogFromEvent = (event: Event, playerNames: string[]): LogType => {
  if (event.keys[0] === SUPPLY_EVENT) {
    return createSupplyLog(parseSupplyEvent(event), playerNames);
  } else if (event.keys[0] === DEFEND_EVENT) {
    return createDefendLog(parseDefendEvent(event), playerNames);
  } else if (event.keys[0] === FORTIFY_EVENT) {
    return createFortifyLog(parseFortifyEvent(event), playerNames);
  } else {
    // if (event.keys[0] === BATTLE_EVENT)
    return createBattleLog(parseBattleEvent(event), playerNames);
  }
};

export const useLogs = () => {
  const [logs, setLogs] = useState<LogType[]>([]);
  const { setLastDefendResult, tilesConqueredThisTurn, setTilesConqueredThisTurn, setLastBattleResult } =
    useElementStore((state) => state);

  useEffect(() => {
    console.log('logs', logs);
  }, [logs]);

  const subscribedRef = useRef(false); // Tracks whether subscriptions have been made
  const {
    setup: {
      updates: {
        eventUpdates: { createSupplyEvents, createDefendEvents, createFortifyEvents },
      },
    },
  } = useDojo();

  const { game_id } = useElementStore((state) => state);
  const { playerNames } = useGetPlayers();

  const addLogIfUnique = (newLog: LogType) => {
    setLogs((prevLogs) => {
      // Check if the log with the same key already exists
      const exists = prevLogs.some((log) => log.key === newLog.key);
      // If it doesn't exist, add it to the logs array
      return exists ? prevLogs : [...prevLogs, newLog];
    });
  };

  // Fetch events history (before subscription)
  useEffect(() => {
    console.log('Fetch events history (before subscription)', game_id);
    // Clear logs when game changes
    setLogs([]);

    const fetchEvents = async (gameId: number) => {
      await fetchEventsOnce([SUPPLY_EVENT, '0x' + gameId.toString(16)], async (event: Event) => {
        addLogIfUnique(generateLogFromEvent(event, playerNames));
      });
      await fetchEventsOnce([FORTIFY_EVENT, '0x' + gameId.toString(16)], async (event) =>
        addLogIfUnique(generateLogFromEvent(event, playerNames))
      );
      await fetchEventsOnce([DEFEND_EVENT, '0x' + gameId.toString(16)], async (event) => {
        const log = generateLogFromEvent(event, playerNames);

        // let's fetch all battle events for this defend event
        const battleEvents: BattleEvent[] = [];
        await fetchEventsOnce([BATTLE_EVENT, '0x' + gameId.toString(16), event.transactionHash], async (event) => {
          const battleEvent = parseBattleEvent(event);
          battleEvents.push(battleEvent);
        });

        if (battleEvents.length !== 0) {
          //console.log('battleEvents', battleEvents);
          const attackerName = playerNames[battleEvents[0].attackerIndex];
          const defenderName = playerNames[battleEvents[0].defenderIndex];
          const battle = getBattleFromBattleEvents(battleEvents, attackerName, defenderName);
          //console.log('battle', battle);

          log.battle = battle;
        }

        addLogIfUnique(log);
        setLastDefendResult(event);
      });
    };

    if (game_id !== undefined) {
      (async () => {
        await fetchEvents(game_id);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game_id]);

  const fetchBattleEvents = async (gameId: number, transactionHash: string) => {
    const battleEvents: BattleEvent[] = [];
    console.log('fetching battle events for defend event', transactionHash);
    await fetchEventsOnce([BATTLE_EVENT, '0x' + gameId.toString(16), transactionHash], async (event) => {
      const battleEvent = parseBattleEvent(event);
      battleEvents.push(battleEvent);
    });
    console.log('battleEvents', battleEvents);

    return battleEvents;
  };

  // Subscribe to events
  useEffect(() => {
    if (game_id !== undefined && playerNames.length !== 0) {
      // Check if already subscribed to prevent duplication due to HMR
      if (!subscribedRef.current) {
        const subscriptions: Subscription[] = [];

        const subscribeToEvents = async () => {
          const supplyObservable = await createSupplyEvents(0);
          const defendObservable = await createDefendEvents(0);
          const fortifyObservable = await createFortifyEvents(0);

          subscriptions.push(
            supplyObservable.subscribe((event) => {
              console.log('supply event', event);
              if (event) {
                addLogIfUnique(generateLogFromEvent(event, playerNames));
              }
            }),

            defendObservable
              .pipe(
                mergeMap(async (event) => {
                  if (!event) return null; // Skip if event is null or undefined

                  console.log('defend event', event);
                  const log = generateLogFromEvent(event, playerNames);
                  console.log('fetching battle events for defend event', event.transactionHash);

                  const battleEvents = await fetchBattleEvents(game_id, event.transactionHash);

                  if (battleEvents.length !== 0) {
                    const attackerName = playerNames[battleEvents[0].attackerIndex];
                    const defenderName = playerNames[battleEvents[0].defenderIndex];
                    const battle = getBattleFromBattleEvents(battleEvents, attackerName, defenderName);

                    log.battle = battle;
                  }

                  return { log, event };
                }),
                // Filter out null results if event was skipped
                filter((result) => result !== null)
              )
              .subscribe((ret) => {
                if (ret === null) return;

                const { log, event } = ret;
                console.log('push log', log);
                addLogIfUnique(log);
                setLastDefendResult(event); // Directly using the event from the merged object
                setLastBattleResult(log.battle ? log.battle : null);
                if (log.log[log.log.length - 1] === 'Result: win' && log.regionTo) {
                  setTilesConqueredThisTurn([...tilesConqueredThisTurn, log.regionTo]);
                }
              }),

            fortifyObservable.subscribe((event) => {
              console.log('fortify event', event);
              if (event) {
                addLogIfUnique(generateLogFromEvent(event, playerNames));
              }
            })
          );

          subscribedRef.current = true; // Mark as subscribed
        };

        subscribeToEvents();
        console.log('Subscribed to all events');

        // Cleanup function to unsubscribe
        return () => {
          console.log('Unsubscribed from all events');
          subscriptions.forEach((sub) => sub.unsubscribe());
          subscribedRef.current = false;
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game_id]);

  return { logs: logs.sort((a, b) => a.timestamp - b.timestamp) };
};
