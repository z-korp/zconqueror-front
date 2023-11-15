import { useDojo } from '@/DojoContext';
import { useComponentStates } from '@/hooks/useComponentState';
import { Phase, useElementStore } from '@/utils/store';
import { useComponentValue } from '@dojoengine/react';
import { getComponentValue, getEntitiesWithValue } from '@latticexyz/recs';
import { useEffect, useRef, useState } from 'react';
import carte from '../../../public/carte.png';
import mapDataRaw from '../../assets/map/map.json';
import mapDataNeighbour from '../../assets/map/mapData/v01.json';
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

  const {
    setup: {
      components: { Tile },
    },
  } = useDojo();

  const { tileIds, turn } = useComponentStates();
  const { current_state, current_source, set_current_source, current_target, set_current_target } = useElementStore(
    (state) => state
  );
  const [clickedRegion, setClickedRegion] = useState<number | null>(null);

  const [supplyModalOpen, setSupplyModalOpen] = useState(false);
  const [attackModalOpen, setAttackModalOpen] = useState(false);
  const [currentRegionSupplyId, setCurrentRegionSupplyId] = useState<number | null>(null);

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

  useEffect(() => {
    setClickedRegion(null);
  }, [current_state]);
  // we may be able to delete this later
  ownedTiles.forEach((tile: any) => {
    const index = tileIds.findIndex((id) => id == tile);
    if (index !== -1) {
      const neighbors = mapDataNeighbour.territories[index].neighbors.map((neighbor) => neighbor + 1);
      allNeighbors = allNeighbors.concat(neighbors);
    }
  });

  const handleRegionClick = (regionId: number) => {
    if (current_state == Phase.DEPLOY) {
      const tile = getComponentValue(Tile, tileIds[regionId - 1]);

      if (tile.owner !== turn) {
        set_current_source(null);
        return;
      }
      setClickedRegion(regionId);

      set_current_source(regionId);

      // setCurrentRegionSupplyId(regionId);

      // setSupplyModalOpen(true);
    } else if (current_state == Phase.ATTACK) {
      const tile = getComponentValue(Tile, tileIds[regionId - 1]);

      if (tile.owner === turn) {
        //TODO HERE

        set_current_source(regionId);
        setClickedRegion(regionId);
      } else {
        if (current_source && mapDataNeighbour.territories[current_source - 1].neighbors.includes(regionId - 1)) {
          set_current_target(regionId);
          setAttackModalOpen(true);
        } else {
          alert('Can t interract with this tile');
        }
      }
    } else if (current_state == Phase.FORTIFY) {
      const tile = getComponentValue(Tile, tileIds[regionId - 1]);
      if (tile.owner === turn) {
        if (current_source) {
          set_current_target(regionId);
        } else {
          set_current_source(regionId);
        }
      }
    }
  };

  return (
    <>
      <div className="relative w-full h-[500px]" ref={containerRef}>
        <img src={carte} alt="Carte" className="w-full h-full absolute top-0 left-0" />
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
                    region={region}
                    containerRef={containerRef}
                    d={`M${item.path} z`}
                    onRegionClick={() => handleRegionClick(item.id)}
                    isSelected={item.id === clickedRegion}
                    fillOpacity={
                      item.id === clickedRegion ? 0.5 : 0.2 // Change opacity if clicked
                    }
                  />
                ))}
              </>
            ))}
          </svg>
        </div>
      </div>
      {/* <SupplyModal
        open={supplyModalOpen}
        player={player}
        onClose={setSupplyModalOpen}
        regionId={currentRegionSupplyId}
      /> */}
    </>
  );
};
export default Map;
