import { useElementStore } from '@/utils/store';
import { useComponentValue } from '@dojoengine/react';
import {
  EntityIndex,
  getComponentEntities,
  getComponentValue,
} from '@latticexyz/recs';
import { useEffect, useState } from 'react';
import { useDojo } from '../DojoContext';
import { getEntityIdFromKeys } from '@/dojo/createSystemCalls';

export const useComponentStates = () => {
  const {
    setup: {
      components: { Game, Player },
    },
  } = useDojo();

  const { ip } = useElementStore((state) => state);

  const entityId = ip as EntityIndex;

  const game = useComponentValue(Game, entityId);

  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    if (game) {
      const playerArray = [];
      for (let i = 0; i < game?.player_count; i++) {
        const playerId = getEntityIdFromKeys([BigInt(game?.id), BigInt(i)]);
        const player = getComponentValue(Player, playerId);
        playerArray.push(player);
      }

      setPlayers(playerArray);
    }
  }, [game]);

  return {
    game: { id: game?.id, over: game?.over, seed: game?.seed },
    players,
  };
};
