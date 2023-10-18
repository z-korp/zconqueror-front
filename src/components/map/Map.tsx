import { useDojo } from '@/DojoContext';
import { useComponentStates } from '@/hooks/useComponentState';
import { getComponentValue } from '@latticexyz/recs';
import { useRef, useState } from 'react';
import carte from '../../../public/carte.png';
import mapDataRaw from '../../assets/map/map-test.json';
import Region from './Region';
import RegionModal from './RegionModal';

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

  const {
    setup: {
      components: { Tile },
    },
  } = useDojo();

  const { tileIds, turn } = useComponentStates();

  const [modalOpen, setModalOpen] = useState(false);
  const [currentRegionId, setCurrentRegionId] = useState<number | null>(null);

  const handleRegionClick = (regionId: number) => {
    console.log('Region clicked', regionId);
    setCurrentRegionId(regionId);
    const tile = getComponentValue(Tile, tileIds[regionId - 1]);
    if (tile.owner !== turn) return;

    setModalOpen(true);
  };

  return (
    <>
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
                    onRegionClick={() => handleRegionClick(item.id)}
                  />
                ))}
              </>
            ))}
          </svg>
        </div>
      </div>
      <RegionModal
        open={modalOpen}
        onClose={setModalOpen}
        regionId={currentRegionId}
      />
    </>
  );
};
export default Map;
