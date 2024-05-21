import { BATTLE_EVENT, DEFEND_EVENT, FORTIFY_EVENT, SUPPLY_EVENT } from '@/constants';
import { useDojo } from '@/dojo/useDojo';
import { fetchEventsOnce } from '@/services/fetchEvents';
import {
  BattleEvent,
  DefendEvent,
  Event,
  FortifyEvent,
  SupplyEvent,
  createDefendLog,
  createFortifyLog,
  createSupplyLog,
  parseBattleEvent,
  parseDefendEvent,
  parseFortifyEvent,
  parseSupplyEvent,
} from '@/utils/events';
import { useElementStore } from '@/utils/store';
import { Battle } from '@/utils/types';
import { useEffect, useRef, useState } from 'react';
import { Subscription, filter, mergeMap } from 'rxjs';
import { useGetPlayers } from './useGetPlayers';
import { getBattleFromBattleEvents } from '@/utils/battle';
import { useGame } from './useGame';

export enum EventType {
  Supply,
  Defend,
  Fortify,
}

export type LogType = {
  key: string;
  timestamp: number;
  type: EventType;
  log: SupplyEvent | DefendEvent | FortifyEvent;
  battle?: Battle;
};

const generateLogFromEvent = (event: Event): LogType => {
  if (event.keys[0] === SUPPLY_EVENT) {
    return createSupplyLog(parseSupplyEvent(event));
  } else if (event.keys[0] === DEFEND_EVENT) {
    return createDefendLog(parseDefendEvent(event));
  } else if (event.keys[0] === FORTIFY_EVENT) {
    return createFortifyLog(parseFortifyEvent(event));
  } // Do not just use else for default state you can receive event that are not the one you want
};

export const useLogs = () => {
  const [logs, setLogs] = useState<LogType[]>([]);
  const { setLastDefendResult, tilesConqueredThisTurn, setTilesConqueredThisTurn, setLastBattleResult, set_last_log } =
    useElementStore((state) => state);

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
  const { game } = useGame();

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
      //console.log('-----------> Fetch events', game_id);
      await fetchEventsOnce([SUPPLY_EVENT, '0x' + gameId.toString(16)], async (event: Event) => {
        addLogIfUnique(generateLogFromEvent(event));
      });
      await fetchEventsOnce([FORTIFY_EVENT, '0x' + gameId.toString(16)], async (event) =>
        addLogIfUnique(generateLogFromEvent(event))
      );
      await fetchEventsOnce([DEFEND_EVENT, '0x' + gameId.toString(16)], async (event) => {
        const log = generateLogFromEvent(event);

        // let's fetch all battle events for this defend event
        const battleEvents: BattleEvent[] = [];
        await fetchEventsOnce([BATTLE_EVENT, '0x' + gameId.toString(16), event.transactionHash], async (event) => {
          const battleEvent = parseBattleEvent(event);
          battleEvents.push(battleEvent);
        });

        if (battleEvents.length !== 0) {
          //console.log('battleEvents', battleEvents);
          const battle = getBattleFromBattleEvents(battleEvents);
          //console.log('battle', battle);

          log.battle = battle;
        }

        addLogIfUnique(log);
        set_last_log(log);
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

    return battleEvents;
  };

  // Subscribe to events
  useEffect(() => {
    if (game_id !== undefined && game?.seed !== 0 && playerNames.length !== 0) {
      // Check if already subscribed to prevent duplication due to HMR
      if (!subscribedRef.current) {
        const subscriptions: Subscription[] = [];

        const subscribeToEvents = async () => {
          const supplyObservable = await createSupplyEvents('0x' + game_id.toString(16));
          const defendObservable = await createDefendEvents('0x' + game_id.toString(16));
          const fortifyObservable = await createFortifyEvents('0x' + game_id.toString(16));

          subscriptions.push(
            supplyObservable.subscribe((event) => {
              if (event) {
                addLogIfUnique(generateLogFromEvent(event));
                set_last_log(generateLogFromEvent(event));
              }
            }),

            defendObservable
              .pipe(
                mergeMap(async (event) => {
                  if (!event) return null; // Skip if event is null or undefined

                  const log = generateLogFromEvent(event);
                  const battleEvents = await fetchBattleEvents(game_id, event.transactionHash);

                  if (battleEvents.length !== 0) {
                    const battle = getBattleFromBattleEvents(battleEvents);

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
                set_last_log(log);

                addLogIfUnique(log);
                setLastDefendResult(event); // Directly using the event from the merged object
                setLastBattleResult(log.battle ? log.battle : null);
                const logDefend = log.log as DefendEvent;
                if (logDefend.result === true) {
                  setTilesConqueredThisTurn([...tilesConqueredThisTurn, logDefend.targetTile]);
                }
              }),

            fortifyObservable.subscribe((event) => {
              if (event) {
                addLogIfUnique(generateLogFromEvent(event));
                set_last_log(generateLogFromEvent(event));
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
  }, [game_id, game?.seed]);

  return { logs: logs.sort((a, b) => a.timestamp - b.timestamp) };
};
