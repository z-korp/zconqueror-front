import { useDojo } from '@/DojoContext';
import { useComponentStates } from '@/hooks/useComponentState';
import { getComponentValue, getEntitiesWithValue } from '@latticexyz/recs';
import { useRef, useState } from 'react';
import carte from '../../../public/carte.png';
import mapDataRaw from '../../assets/map/map-test.json';
import Region from './Region';
import RegionModal from './RegionModal';
import { useElementStore } from '@/utils/store';
import mapDataNeighbour from '../../assets/map/mapData/v00.json';
import { useComponentValue } from '@dojoengine/react';

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
  const { current_state } = useElementStore((state) => state);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentRegionId, setCurrentRegionId] = useState<number | null>(null);

  const {
    setup: {
      components: { Player },
      systemCalls: { supply },
    },
    account: { account },
  } = useDojo();

  const { currentPlayerId } = useComponentStates();
  const player = useComponentValue(Player, currentPlayerId);
  const ownedTiles = getEntitiesWithValue(Tile, { owner: turn });

  let allNeighbors: number[] = [];

  ownedTiles.forEach((tile: any) => {
    let index = tileIds.findIndex((id) => id == tile);
    if (index !== -1) {
      let neighbors = mapDataNeighbour.territories[index].neighbors.map(
        (neighbor) => neighbor + 1
      );
      allNeighbors = allNeighbors.concat(neighbors);
    }
  });

  const handleRegionClick = (regionId: number) => {
    console.log('Region clicked', regionId);
    setCurrentRegionId(regionId);
    const tile = getComponentValue(Tile, tileIds[regionId - 1]);
    if (current_state == 1) {
      if (tile.owner !== turn) return;

      setModalOpen(true);
    } else if (current_state == 2) {
      if (allNeighbors.includes(regionId)) {
        console.log('ATTACK');
      } else {
        console.log('NOT ATTACK');
      }
    }
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
        player={player}
        onClose={setModalOpen}
        regionId={currentRegionId}
      />
    </>
  );
};
export default Map;
