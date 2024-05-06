import { useDojo } from '@/dojo/useDojo';
import { useEffect, useRef, useState } from 'react';
import { Subscription } from 'rxjs';
import { useGame } from './useGame';
import { useElementStore } from '@/utils/store';
import { useGetPlayers } from './useGetPlayers';

export const useEmotes = () => {
  const { game_id } = useElementStore((state) => state);
  const { playerNames } = useGetPlayers();
  const { game } = useGame();
  const {
    setup: {
      updates: {
        eventUpdates: { createEmoteEvents },
      },
    },
  } = useDojo();

  const subscribedRef = useRef(false);
  const [emote, setEmote] = useState<string[]>([]);

  // Subscribe to events
  useEffect(() => {
    if (game_id !== undefined && game?.seed !== 0 && playerNames.length !== 0) {
      if (!subscribedRef.current) {
        const subscriptions: Subscription[] = [];

        const subscribeToEvents = async () => {
          const emoteObservable = await createEmoteEvents(0);

          subscriptions.push(
            emoteObservable.subscribe((event) => {
              if (event) {
                setEmote(event.data);
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
  }, [game?.seed, game_id, playerNames.length, createEmoteEvents]);

  return {
    emote,
  };
};
