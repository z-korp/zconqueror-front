import { useDojo } from '@/DojoContext';
import { DEFEND_EVENT, SUPPLY_EVENT } from '@/constants';
import { Event } from '@/dojo/createEventSubscription';
import {
  createDefendLog,
  createFortifyLog,
  createSupplyLog,
  parseDefendEvent,
  parseFortifyEvent,
  parseSupplyEvent,
} from '@/utils/events';
import { useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';

export enum EventType {
  Supply,
  Defend,
  Fortify,
}

export type LogType = { timestamp: number; log: string };

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

  useEffect(() => {
    // Check if already subscribed to prevent duplication due to HMR
    if (!subscribedRef.current) {
      const subscriptions: Subscription[] = [];

      const subscribeToEvents = async () => {
        console.log('Subscribing to events');

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
        subscriptions.forEach((sub) => sub.unsubscribe());
        console.log('Unsubscribed from all events');
        subscribedRef.current = false;
      };
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return { logs };
};
