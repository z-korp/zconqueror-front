import { useGetTiles } from '@/hooks/useGetTiles';
import { usePhase } from '@/hooks/usePhase';
import { useTurn } from '@/hooks/useTurn';
import { getNeighbors } from '@/utils/map';
import { Phase, useElementStore } from '@/utils/store';
import { Fragment, useRef, useState } from 'react';
import mapReliefSvg from '../../../public/map_original_relief.svg';
import mapDataRaw from '../../assets/map/map.json';
import Region from './Region';
import { useMe } from '@/hooks/useMe';
import { isTest } from '@/utils/test';

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
  const { isItMyTurn } = useMe();

  const { turn } = useTurn();
  const { phase } = usePhase();
  const { tiles } = useGetTiles();
  const { current_source, set_current_source, set_current_target } = useElementStore((state) => state);

  const handleRegionClick = (regionId: number) => {
    if (isTest) console.log('regionId', regionId);
    if (!isItMyTurn) return;

    const tile = tiles[regionId - 1];
    if (tile === undefined) return;
    if (phase == Phase.DEPLOY) {
      if (tile.owner !== turn) {
        set_current_source(null);
        return;
      }
      set_current_source(regionId);
    } else if (phase == Phase.ATTACK) {
      // if clicked tile is owned by the player
      // and has more than 1 army
      if (tile.owner === turn && tile.army > 1) {
        set_current_source(regionId);
        set_current_target(null);
      } else {
        // otherwise if clicked tile is not owned by the player
        if (current_source && getNeighbors(current_source).includes(regionId)) {
          // and is a neighbor of the current source
          set_current_target(regionId);
        } else {
          console.log('Can t interract with this tile');
        }
      }
    } else if (phase == Phase.FORTIFY) {
      console.log('phase fortify');
      // if clicked tile is owned by the player
      if (tile.owner === turn) {
        if (current_source) {
          // if a source is already selected
          if (getNeighbors(current_source).includes(regionId)) {
            // and the clicked tile is a neighbor
            // then we set the target
            set_current_target(regionId);
          } else {
            // otherwise we set the source
            if (tile.army > 1) {
              set_current_source(regionId);
              set_current_target(null);
            }
          }
        } else {
          if (tile.army > 1) {
            set_current_source(regionId);
            set_current_target(null);
          }
        }
      } else {
        console.log('Can t interract with this tile');
      }
    }
  };
  const [isZoomed, setIsZoomed] = useState(false);
  //const [clickPosition, setClickPosition] = useState({ x: 0, y: 0, rectWidth: 0, rectHeight: 0 });

  const toggleZoom = (e: any) => {
    return;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX; // Position X du clic par rapport à la div
    const y = e.clientY; // Position Y du clic par rapport à la div

    const rectWidth = rect.width; // Largeur de la div
    const rectHeight = rect.height; // Hauteur de la div

    console.log(x, y);
    console.log(rect.left, rect.top, rectWidth, rectHeight);

    setClickPosition({ x, y, rectWidth, rectHeight });
    setIsZoomed(!isZoomed);
  };

  const zoomStyle = isZoomed
    ? {
        // transform: `scale(1.25) translate(${clickPosition.rectWidth / 2 - clickPosition.x}px, ${
        //   clickPosition.rectHeight / 2 - clickPosition.y
        // }px)`,
        transform: `translate(-1000px,1000px)`,
        transition: 'transform 1s ease-in-out', // Durée de l'animation
      }
    : {};

  return (
    <>
      <div className="relative" ref={containerRef}>
        <div className={`h-[600px] w-full`} onClick={(e) => toggleZoom(e)} style={zoomStyle}>
          <svg
            viewBox="0 0 3669 1932" // Ajustez cette valeur en fonction de vos coordonnées
            className="absolute top-0 left-0 w-full h-full"
            overflow="visible"
          >
            <image
              href={mapReliefSvg}
              width="108%"
              height="108%"
              x={(3669 - 3669 * 1.08) / 2}
              y={(1932 - 1932 * 1.08) / 2}
            />
            {Object.keys(mapData).map((region) => (
              <Fragment key={region}>
                {mapData[region].map((item) => (
                  <Region
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
