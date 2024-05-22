import { DEFEND_EVENT, FORTIFY_EVENT, SUPPLY_EVENT, EMOTE_EVENT } from '../constants';
import { createEventSubscription } from './createEventSubscription';

export const createUpdates = async (components: Components) => {
  const eventUpdates = {
    createSupplyEvents: async (gameId: string) => createEventSubscription([SUPPLY_EVENT, gameId]),
    createDefendEvents: async (gameId: string) => createEventSubscription([DEFEND_EVENT, gameId]),
    createFortifyEvents: async (gameId: string) => createEventSubscription([FORTIFY_EVENT, gameId]),
    createEmoteEvents: async (gameId: string) => createEventSubscription([EMOTE_EVENT, gameId]),
  };

  return {
    eventUpdates,
  };
};
