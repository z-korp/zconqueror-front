import React, { useRef } from 'react';
import carte from '../../../public/carte.png';
import Region from './region';

import { useComponentStates } from '@/hooks/useComponentState';
import { colorPlayer } from '@/utils/colors';
import mapDataRaw from '../../assets/map/map-test.json';

const mapData: MapData = mapDataRaw;

interface PathItem {
  id: number;
  path: string;
}

interface MapData {
  [key: string]: PathItem[];
}

interface MapProps {
  handleRegionClick: (region: string) => void;
}

const Map: React.FC<MapProps> = ({ handleRegionClick }: MapProps) => {
  const { tiles } = useComponentStates();

  const containerRef = useRef(null);

  return (
    <div className="relative w-full h-[500px]" ref={containerRef}>
      <img
        src={carte}
        alt="Carte"
        className="w-full h-full absolute top-0 left-0"
      />
      <div className="w-full h-full absolute top-0 left-0">
        <svg
          viewBox="0 0 3669 1932" // Ajustez cette valeur en fonction de vos coordonnées
          preserveAspectRatio="none"
          className="w-full h-full absolute top-0 left-0"
        >
          {Object.keys(mapData).map((region) => (
            <>
              {mapData[region].map((item) => {
                const tile = tiles[item.id - 1];
                const troups = tile ? tile.army : 0;
                const color = tile ? colorPlayer[tile.owner + 1 || 0] : 'white';
                return (
                  <Region
                    id={item.id}
                    fill={color}
                    fillOpacity={0.5}
                    region={region}
                    troups={troups}
                    containerRef={containerRef}
                    d={`M${item.path} z`}
                  />
                );
              })}
            </>
          ))}
        </svg>
      </div>
    </div>
  );
};
export default Map;
