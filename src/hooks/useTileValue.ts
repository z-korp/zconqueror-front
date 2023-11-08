import { useEffect, useState } from 'react';
import { getComponentEntities, getComponentValue } from '@latticexyz/recs';

import { useDojo } from '@/DojoContext';

export function useTileValues(open: boolean, source: number | null, target: number | null) {
  const [tileRetrieved, setTileRetrieved] = useState<any[]>([]);
  const [sourceTile, setSourceTile] = useState<any | null>(null);
  const [targetTile, setTargetTile] = useState<any | null>(null);

  const {
    setup: {
      components: { Player, Tile },
    },
  } = useDojo();

  useEffect(() => {
    const tilesEntities = getComponentEntities(Tile);
    console.log('tileEntities', tilesEntities);
    const tileRetrieved = [...tilesEntities].map((id) => getComponentValue(Tile, id)) as any[];
    setTileRetrieved(tileRetrieved);
  }, []);

  useEffect(() => {
    console.log('SOURCE');
    console.log('tileEntities', tileRetrieved);
    console.log('target', target);
    console.log('source', source);

    if (source === null || target === null) return;
    setSourceTile(tileRetrieved[source - 1]);
    setTargetTile(tileRetrieved[target - 1]);
  }, [tileRetrieved, source, target]);

  return { source_tile: sourceTile, target_tile: targetTile };
}
