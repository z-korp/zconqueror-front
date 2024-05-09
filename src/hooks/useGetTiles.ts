import { useMemo } from 'react';
import { useDojo } from '@/dojo/useDojo';
import { useElementStore } from '@/utils/store';
import { useEntityQuery } from '@dojoengine/react';
import { Has, HasValue, getComponentValue } from '@dojoengine/recs';
import { useTurn } from './useTurn';

export function useGetTiles() {
  const { turn } = useTurn();
  const {
    setup: {
      clientComponents: { Tile },
    },
  } = useDojo();

  const { game_id } = useElementStore((state) => state);

  const tileEntities = useEntityQuery([Has(Tile), HasValue(Tile, { game_id: game_id })]);

  // Memoize the transformation to minimize reference changes
  const tilesData = useMemo(() => {
    const detailedTiles = tileEntities.map((entityId) => ({
      entityId,
      tile: getComponentValue(Tile, entityId),
    }));

    // Sort the tiles by id to ensure consistent ordering in array
    return detailedTiles.sort((a, b) => a.tile.id - b.tile.id);
  }, [tileEntities, game_id, turn]);

  // Extract the sorted tiles and entityIds after transformation to minimize re-renders
  const tiles = useMemo(() => tilesData.map((t) => t.tile), [tilesData]);
  const tilesEntities = useMemo(() => tilesData.map((t) => t.entityId), [tilesData]);

  return {
    tiles,
    tilesEntities,
  };
}
