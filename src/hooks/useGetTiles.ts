import { useMemo } from 'react';
import { useDojo } from '@/dojo/useDojo';
import { useElementStore } from '@/utils/store';
import { useEntityQuery } from '@dojoengine/react';
import { Has, HasValue, getComponentValue } from '@dojoengine/recs';
import { Tile } from '@/utils/types';

export function useGetTiles() {
  const {
    setup: {
      clientComponents: { Tile },
    },
  } = useDojo();

  const { game_id } = useElementStore((state) => state);
  const tileEntities = useEntityQuery([Has(Tile), HasValue(Tile, { game_id: game_id })]);

  const tiles: Tile[] = useMemo(
    () => tileEntities.map((id) => getComponentValue(Tile, id)).sort((a, b) => a.id - b.id),
    [tileEntities, Tile]
  );

  return {
    tiles,
  };
}
