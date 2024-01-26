import { getEntityIdFromKeys } from '@dojoengine/utils';
import { useElementStore } from '@/utils/store';
import { EntityIndex, getComponentValue } from '@latticexyz/recs';
import { useEffect, useState } from 'react';
import { useDojo } from '../DojoContext';

export const useComponentStates = () => {
  const {
    setup: {
      clientComponents: { Game, Player, Tile },
    },
  } = useDojo();

  const { game_id } = useElementStore((state) => state);

  const [turn, setTurn] = useState<number>(0);

  const [players, setPlayers] = useState<any[]>([]);
  const [playerIds, setPlayerIds] = useState<number[]>([]);
  const [player, setPlayer] = useState<any>(null);
  const [tiles, setTiles] = useState<any[]>([]);
  const [tileIds, setTileIds] = useState<number[]>([]);
  const [entityId, setEntityId] = useState<EntityIndex | null>(null);
  const [game, setGame] = useState<any>(null);

  useEffect(() => {
    if (game_id !== undefined && game_id !== null) {
      setEntityId(getEntityIdFromKeys([BigInt(game_id)]));
    }
  }, [game_id]);

  useEffect(() => {
    setGame(getComponentValue(Game, entityId));
  }, [entityId]);

  useEffect(() => {
    if (game) {
      const playerArray = [];
      const playerIdsArray = [];
      for (let i = 0; i < game?.player_count; i++) {
        const playerId = getEntityIdFromKeys([BigInt(game?.id), BigInt(i)]);
        playerIdsArray.push(playerId);
        const player = getComponentValue(Player, playerId);
        if (player !== undefined) {
          playerArray.push(player);
          if (player.address === import.meta.env.VITE_PUBLIC_MASTER_ADDRESS) {
            setPlayer(player);
          }
        }
      }
      setPlayers(playerArray);
      setPlayerIds(playerIdsArray);

      const tileArray = [];
      const tileIdsArray = [];
      const NUMBER_TILES = 50;
      for (let i = 1; i < NUMBER_TILES + 1; i++) {
        const tileId = getEntityIdFromKeys([BigInt(game?.id), BigInt(i)]);
        tileIdsArray.push(tileId);
        const tile = getComponentValue(Tile, tileId);
        tileArray.push(tile);
      }
      setTiles(tileArray);
      setTileIds(tileIdsArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

  useEffect(() => {
    if (game && game.nonce !== undefined && Math.floor(game.nonce / 3) % game.player_count !== turn) {
      setTurn(Math.floor(game.nonce / 3) % game.player_count);
    }
  }, [game]);

  const [currentPlayerId, setCurrentPlayerId] = useState<number | null>(null);

  useEffect(() => {
    if (playerIds.length > 0 && turn < playerIds.length) {
      setCurrentPlayerId(playerIds[turn]);
    }
  }, [turn, playerIds]);

  return {
    game: { id: game?.id, over: game?.over, seed: game?.seed },
    players,
    playerIds,
    player,
    tiles,
    tileIds,
    turn,
    currentPlayerId,
  };
};
