import { Components } from '@dojoengine/recs';
import { BATTLE_EVENT, DEFEND_EVENT, FORTIFY_EVENT, SUPPLY_EVENT } from '../constants';
import { createEventSubscription } from './createEventSubscription';

export const createUpdates = async (components: Components) => {
  const eventUpdates = {
    createSupplyEvents: async (entityId: number) => createEventSubscription([SUPPLY_EVENT]),
    createDefendEvents: async (entityId: number) => createEventSubscription([DEFEND_EVENT]),
    createFortifyEvents: async (entityId: number) => createEventSubscription([FORTIFY_EVENT]),
    createBattleEvents: async (entityId: number) => createEventSubscription([BATTLE_EVENT]),
  };

  return {
    eventUpdates,
  };
};
