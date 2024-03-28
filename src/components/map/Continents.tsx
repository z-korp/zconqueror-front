import { useEffect, useState } from 'react';
import continentsData from '../../assets/map/continents.json';
import Continent from './Continent';
import { useGetTiles } from '@/hooks/useGetTiles';
import { useElementStore } from '@/utils/store';
import { Continent as ContinentType } from '@/utils/types';
import { useGetPlayers } from '@/hooks/useGetPlayers';

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
  const { players } = useGetPlayers();
  const [highlightedContinents, setHighlightedContinents] = useState<Set<number>>(new Set());

  useEffect(() => {
    const continentOwners = new Map<number, number>();

    continentsData.continents.forEach((continent) => {
      const playerIndexWhoOwnsContinent = players.find((player) =>
        continent.regions.every((regionId) => tiles.find((tile) => tile.id === regionId && tile.owner === player.index))
      )?.index;

      if (playerIndexWhoOwnsContinent !== undefined) {
        continentOwners.set(continent.id, playerIndexWhoOwnsContinent);
      }
    });

    setHighlightedContinents(new Set(continentOwners.keys()));
  }, [players, tiles]);

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
