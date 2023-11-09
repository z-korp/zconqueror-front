import { useDojo } from '@/DojoContext';
import { useComponentStates } from '@/hooks/useComponentState';
import { useElementStore } from '@/utils/store';
import { useComponentValue } from '@dojoengine/react';
import { getComponentValue, getEntitiesWithValue } from '@latticexyz/recs';
import { useEffect, useRef, useState } from 'react';
import carte from '../../../public/carte.png';
import mapDataRaw from '../../assets/map/map-test.json';
import mapDataNeighbour from '../../assets/map/mapData/v00.json';
import AttackModal from './AttackModal';
import Region from './Region';
import SupplyModal from './SupplyModal';
import { useTileValues } from '@/hooks/useTileValue';

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
  const { current_state, set_current_fortified, set_current_fortifier, current_fortified, current_fortifier } =
    useElementStore((state) => state);
  const [clickedRegion, setClickedRegion] = useState<number | null>(null);

  const [supplyModalOpen, setSupplyModalOpen] = useState(false);
  const [attackModalOpen, setAttackModalOpen] = useState(false);
  const [currentRegionSupplyId, setCurrentRegionSupplyId] = useState<number | null>(null);
  const [currentRegionAttacker, setCurrentRegionAttacker] = useState<number | null>(null);
  const [currentRegionDefender, setCurrentRegionDefender] = useState<number | null>(null);

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
  // const { source_tile, target_tile } = useTileValues(currentRegionAttacker, regionId);

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
    // console.log(source_tile, target_tile);
    setClickedRegion(regionId);
    if (current_state == 1) {
      setCurrentRegionSupplyId(regionId);
      const tile = getComponentValue(Tile, tileIds[regionId - 1]);
      if (tile.owner !== turn) return;

      setSupplyModalOpen(true);
    } else if (current_state == 2) {
      const tile = getComponentValue(Tile, tileIds[regionId - 1]);
      if (tile.owner === turn) {
        setCurrentRegionAttacker(regionId);
      } else {
        if (
          currentRegionAttacker &&
          mapDataNeighbour.territories[currentRegionAttacker].neighbors.includes(regionId + 1)
        ) {
          setCurrentRegionDefender(regionId);
          setAttackModalOpen(true);
        } else {
          alert('Can t interract with this tile');
        }
      }
    } else if (current_state == 3) {
      const tile = getComponentValue(Tile, tileIds[regionId - 1]);
      if (tile.owner === turn) {
        if (current_fortifier) {
          set_current_fortified(regionId);
        } else {
          set_current_fortifier(regionId);
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
      <SupplyModal
        open={supplyModalOpen}
        player={player}
        onClose={setSupplyModalOpen}
        regionId={currentRegionSupplyId}
      />
      <AttackModal
        open={attackModalOpen}
        player={player}
        attacker={currentRegionAttacker}
        defender={currentRegionDefender}
        onClose={setAttackModalOpen}
      />
    </>
  );
};
export default Map;
