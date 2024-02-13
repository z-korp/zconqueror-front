import { useDojo } from '@/dojo/useDojo';
import { useElementStore } from '@/utils/store';
import { useEntityQuery } from '@dojoengine/react';
import { Has, HasValue, getComponentValue } from '@dojoengine/recs';
import { useEffect, useMemo } from 'react';

export function useGetTiles() {
  const {
    setup: {
      clientComponents: { Tile },
    },
  } = useDojo();

  const { game } = useElementStore((state) => state);
  const tileEntities = useEntityQuery([Has(Tile), HasValue(Tile, { game_id: game?.id })]);

  const tiles = useMemo(
    () => tileEntities.map((id) => getComponentValue(Tile, id)).sort((a, b) => a.id - b.id),
    [tileEntities, Tile]
  );

  /*useEffect(() => {
    console.log('tiles', tiles);
  }, [tiles]);*/

  return {
    tiles,
  };
}
