import { useEffect, useState } from 'react';
import continentsData from '../../assets/map/continents.json';
import Continent from './Continent';
import { useGetTiles } from '@/hooks/useGetTiles';
import { useMe } from '@/hooks/useMe';
import { useElementStore } from '@/utils/store';
import { Continent as ContinentType } from '@/utils/types';

export interface ContinentsData {
  continents: ContinentType[];
}

const data: ContinentsData = continentsData;

interface ContinentsProps {
  containerRef?: React.MutableRefObject<null>;
}

const Continents: React.FC<ContinentsProps> = ({ containerRef }) => {
  const { isContinentMode } = useElementStore((state) => state);
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
      {data.continents.map((continent) => (
        <Continent
          key={continent.id}
          containerRef={containerRef}
          continent={continent}
          isVisible={isContinentMode ? true : highlightedContinents.has(continent.id)}
          svgPath={`/svgs/continents/${continent.id}.svg`}
        />
      ))}
    </>
  );
};

export default Continents;
