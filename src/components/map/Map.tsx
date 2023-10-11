import { useRef } from 'react';
import carte from '../../../public/carte.png';
import mapDataRaw from '../../assets/map/map-test.json';
import Region from './Region';

const mapData: MapData = mapDataRaw;

interface PathItem {
  id: number;
  path: string;
}

interface MapData {
  [key: string]: PathItem[];
}

const Map = () => {
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
              {mapData[region].map((item) => (
                <Region
                  key={item.id}
                  id={item.id}
                  fillOpacity={0.5}
                  region={region}
                  containerRef={containerRef}
                  d={`M${item.path} z`}
                />
              ))}
            </>
          ))}
        </svg>
      </div>
    </div>
  );
};
export default Map;
