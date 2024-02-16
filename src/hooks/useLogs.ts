import { DEFEND_EVENT, FORTIFY_EVENT, SUPPLY_EVENT } from '@/constants';
import { useDojo } from '@/dojo/useDojo';
import { fetchEventsOnce } from '@/services/fetchEvents';
import {
  Event,
  createDefendLog,
  createFortifyLog,
  createSupplyLog,
  parseDefendEvent,
  parseFortifyEvent,
  parseSupplyEvent,
} from '@/utils/events';
import { useElementStore } from '@/utils/store';
import { useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';

export enum EventType {
  Supply,
  Defend,
  Fortify,
}

export type LogType = { timestamp: number; log: string[]; regionFrom?: number; regionTo?: number; type: EventType };

const generateLogFromEvent = (event: Event): LogType => {
  if (event.keys[0] === SUPPLY_EVENT) {
    return createSupplyLog(parseSupplyEvent(event));
  } else if (event.keys[0] === DEFEND_EVENT) {
    return createDefendLog(parseDefendEvent(event));
  } // (event.keys[0] === FORTIFY_EVENT)
  else {
    return createFortifyLog(parseFortifyEvent(event));
  }
};

export const useLogs = () => {
  const [logs, setLogs] = useState<LogType[]>([]);
  const subscribedRef = useRef(false); // Tracks whether subscriptions have been made

  const {
    setup: {
      updates: {
        eventUpdates: { createSupplyEvents, createDefendEvents, createFortifyEvents },
      },
    },
  } = useDojo();

  const { game_id } = useElementStore((state) => state);

  // Subscribe to events
  useEffect(() => {
    // Check if already subscribed to prevent duplication due to HMR
    if (!subscribedRef.current) {
      const subscriptions: Subscription[] = [];

      const subscribeToEvents = async () => {
        const supplyObservable = await createSupplyEvents(0);
        const defendObservable = await createDefendEvents(0);
        const fortifyObservable = await createFortifyEvents(0);

        subscriptions.push(
          supplyObservable.subscribe((event) => {
            if (event) {
              setLogs((prevLogs) => [...prevLogs, generateLogFromEvent(event)]);
            }
          }),

          defendObservable.subscribe((event) => {
            if (event) {
              setLogs((prevLogs) => [...prevLogs, generateLogFromEvent(event)]);
            }
          }),

          fortifyObservable.subscribe((event) => {
            if (event) {
              setLogs((prevLogs) => [...prevLogs, generateLogFromEvent(event)]);
            }
          })
        );

        subscribedRef.current = true; // Mark as subscribed
      };

      subscribeToEvents();

      // Cleanup function to unsubscribe
      return () => {
        console.log('Unsubscribed from all events');
        subscriptions.forEach((sub) => sub.unsubscribe());
        subscribedRef.current = false;
      };
    }
  }, []);

  // Fetch events history (before subscription)
  useEffect(() => {
    // Clear logs when game changes
    setLogs([]);

    const fetchEvents = async () => {
      // Assuming fetchEventsOnce is defined elsewhere and handles fetching events based on the provided arguments
      await fetchEventsOnce([SUPPLY_EVENT, '0x' + game_id.toString(16)], (event: Event) =>
        setLogs((prevLogs) => [...prevLogs, generateLogFromEvent(event)])
      );
      await fetchEventsOnce([FORTIFY_EVENT, '0x' + game_id.toString(16)], (event) =>
        setLogs((prevLogs) => [...prevLogs, generateLogFromEvent(event)])
      );
      await fetchEventsOnce([DEFEND_EVENT, '0x' + game_id.toString(16)], (event) =>
        setLogs((prevLogs) => [...prevLogs, generateLogFromEvent(event)])
      );
    };

    if (game_id) fetchEvents();
  }, [game_id]);

  return { logs: logs.sort((a, b) => a.timestamp - b.timestamp) };
};
