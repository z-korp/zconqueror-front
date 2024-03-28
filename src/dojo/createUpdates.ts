import { Components } from '@dojoengine/recs';
import { DEFEND_EVENT, FORTIFY_EVENT, SUPPLY_EVENT, EMOTE_EVENT } from '../constants';
import { createEventSubscription } from './createEventSubscription';

export const createUpdates = async (components: Components) => {
  const eventUpdates = {
    createSupplyEvents: async (entityId: number) => createEventSubscription([SUPPLY_EVENT]),
    createDefendEvents: async (entityId: number) => createEventSubscription([DEFEND_EVENT]),
    createFortifyEvents: async (entityId: number) => createEventSubscription([FORTIFY_EVENT]),
    createEmoteEvents: async (entityId: number) => createEventSubscription([EMOTE_EVENT]),
  };

  return {
    eventUpdates,
  };
};
