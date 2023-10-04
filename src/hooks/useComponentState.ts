import { getEntityIdFromKeys } from '@/dojo/createSystemCalls';
import { useElementStore } from '@/utils/store';
import { useComponentValue } from '@dojoengine/react';
import { EntityIndex, getComponentValue } from '@latticexyz/recs';
import { useEffect, useState } from 'react';
import { useDojo } from '../DojoContext';

export const useComponentStates = () => {
  const {
    setup: {
      components: { Game, Player, Tile },
    },
  } = useDojo();

  const { ip } = useElementStore((state) => state);

  const entityId = ip as EntityIndex;

  const game = useComponentValue(Game, entityId);

  const [players, setPlayers] = useState<any[]>([]);
  const [tiles, setTiles] = useState<any[]>([]);

  useEffect(() => {
    if (game) {
      const playerArray = [];
      for (let i = 0; i < game?.player_count; i++) {
        const playerId = getEntityIdFromKeys([BigInt(game?.id), BigInt(i)]);
        const player = getComponentValue(Player, playerId);
        console.log('player', player);
        playerArray.push(player);
      }
      setPlayers(playerArray);

      const tileArray = [];
      const NUMBER_TILES = 5;
      for (let i = 1; i < NUMBER_TILES + 1; i++) {
        const tileId = getEntityIdFromKeys([BigInt(game?.id), BigInt(i)]);
        const tile = getComponentValue(Tile, tileId);
        tileArray.push(tile);
      }
      setTiles(tileArray);
    }
  }, [game]);

  console.log(players[2]);

  return {
    game: { id: game?.id, over: game?.over, seed: game?.seed },
    players,
    tiles,
  };
};
