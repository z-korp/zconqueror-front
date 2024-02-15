import { overridableComponent } from '@dojoengine/recs';
import { ContractComponents } from './generated/contractComponents';

export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({ contractComponents }: { contractComponents: ContractComponents }) {
  return {
    ...contractComponents,
    Game: overridableComponent(contractComponents.Game),
    Player: overridableComponent(contractComponents.Player),
    Tile: overridableComponent(contractComponents.Tile),
  };
}
