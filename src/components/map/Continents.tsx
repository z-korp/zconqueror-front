import { useEffect, useState } from 'react';
import continentsData from '../../assets/map/continents.json';
import Continent from './Continent';
import { useGetTiles } from '@/hooks/useGetTiles';
import { useMe } from '@/hooks/useMe';

const Continents = () => {
  const { tiles } = useGetTiles();
  const { me } = useMe();
  const [highlightedContinents, setHighlightedContinents] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!me) return;

    const playerTilesSet = new Set(tiles.filter((t) => t.owner === me.index).map((t) => t.id));

    const continentsToHighlight = continentsData.continents
      .filter((continent) => continent.regions.every((region) => playerTilesSet.has(region)))
      .map((continent) => continent.id);

    setHighlightedContinents(new Set(continentsToHighlight));
  }, [me, tiles]);

  return (
    <>
      {continentsData.continents.map((continent) => (
        <Continent
          key={continent.id}
          isVisible={highlightedContinents.has(continent.id)}
          svgPath={`/svgs/continents/${continent.id}.svg`}
        />
      ))}
    </>
  );
};

export default Continents;
