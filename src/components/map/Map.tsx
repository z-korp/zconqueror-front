import { useDojo } from '@/DojoContext';
import { useComponentStates } from '@/hooks/useComponentState';
import { getNeighbors } from '@/utils/map';
import { Phase, useElementStore } from '@/utils/store';
import { getComponentValue } from '@latticexyz/recs';
import { Fragment, useRef } from 'react';
import carte from '../../../public/map_sea3D.png';
import mapDataRaw from '../../assets/map/map.json';
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
  const { current_state, current_source, set_current_source, set_current_target } = useElementStore((state) => state);

  const handleRegionClick = (regionId: number) => {
    const tile = getComponentValue(Tile, tileIds[regionId - 1]);
    if (current_state == Phase.DEPLOY) {
      if (tile.owner !== turn) {
        set_current_source(null);
        return;
      }
      set_current_source(regionId);
    } else if (current_state == Phase.ATTACK) {
      if (tile !== undefined) {
        if (tile.owner === turn) {
          set_current_source(regionId);
          set_current_target(null);
        } else {
          if (current_source && getNeighbors(current_source).includes(regionId)) {
            set_current_target(regionId);
          } else {
            console.log('Can t interract with this tile');
          }
        }
      } else {
        console.log('Can t interract with this tile');
      }
    } else if (current_state == Phase.FORTIFY) {
      // if clicked tile is owned by the player
      if (tile.owner === turn) {
        if (current_source) {
          set_current_target(regionId);
        } else {
          set_current_source(regionId);
        }
      } else {
        console.log('Can t interract with this tile');
      }
    }
  };

  return (
    <>
      <div className="relative w-full h-[500px]" ref={containerRef}>
        <div className="w-full h-full absolute top-0 left-0">
          <svg
            viewBox="0 0 3669 1932" // Ajustez cette valeur en fonction de vos coordonnées
            preserveAspectRatio="none"
            className="w-full h-full absolute top-0 left-0 fill-cyan-500"
            width={'100%'}
            height={'100%'}
          >
            <image href={carte} width="100%" height="100%" />

            {Object.keys(mapData).map((region) => (
              <Fragment key={region}>
                {mapData[region].map((item) => (
                  <Region
                    playerTurn={turn}
                    key={item.id}
                    id={item.id}
                    region={region}
                    containerRef={containerRef}
                    d={`M${item.path} z`}
                    onRegionClick={() => handleRegionClick(item.id)}
                  />
                ))}
              </Fragment>
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
