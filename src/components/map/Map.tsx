import { useGetTiles } from '@/hooks/useGetTiles';
import { usePhase } from '@/hooks/usePhase';
import { useTurn } from '@/hooks/useTurn';
import { getNeighbors } from '@/utils/map';
import { Phase, useElementStore } from '@/utils/store';
import { useRef } from 'react';
import { useMe } from '@/hooks/useMe';
import { isTest } from '@/utils/test';
import Continents from './Continents';
import Svg from './Svg';
import Region from './Region';
import nameData from '../../assets/map/nameData.json'; // Adjust the path as necessary
import { Button } from '../ui/button';
import { useDojo } from '@/dojo/useDojo';
import { BadgeHelp, Flag, Map as MapLucid } from 'lucide-react';
import { useTutorial } from '../../contexts/TutorialContext';
import DynamicOverlayTuto from '../DynamicOverlayTuto';
import tutorialData from '../../data/tutorialSteps.json';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog';
import MusicButton from '../MusicButton';

const Map = () => {
  const {
    setup: {
      client: { play },
    },
    account: { account },
  } = useDojo();
  const containerRef = useRef(null);
  const { isItMyTurn } = useMe();

  const { turn } = useTurn();
  const { phase } = usePhase();
  const { tiles } = useGetTiles();
  const { current_source, set_current_source, set_current_target, setContinentMode, isContinentMode, game_id } =
    useElementStore((state) => state);

  const surrender = async () => {
    if (game_id) await play.surrender(account, game_id);
  };

  const { setShowTuto } = useTutorial();

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
        if (current_source && getNeighbors(current_source).includes(regionId) && tile.owner !== turn) {
          // and is a neighbor of the current source
          set_current_target(regionId);
        } else {
          console.log('Can t interract with this tile');
        }
      }
    } else if (phase == Phase.FORTIFY) {
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

  function handleShowTuto() {
    setShowTuto(true);
  }

  return (
    <>
      <div className="relative z-0" ref={containerRef}>
        <div className="absolute z-20 top-0 right-0 gap-2 flex">
          <DynamicOverlayTuto tutorialStep="6" texts={tutorialData['6']}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  onMouseEnter={() => setContinentMode(true)} // Activates when the mouse enters the button area
                  onMouseLeave={() => setContinentMode(false)} // Deactivates when the mouse leaves the button area
                >
                  <MapLucid />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Continents</TooltipContent>
            </Tooltip>
          </DynamicOverlayTuto>

          <div>
            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button variant="secondary">
                      <Flag />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Surrender</TooltipContent>
              </Tooltip>
              <DialogContent className="sm:max-w-md bg-stone-700 border-2 border-black">
                <DialogHeader>
                  <DialogTitle className="text-white text-xl">Do you confirm you want to surrender?</DialogTitle>
                </DialogHeader>
                <DialogFooter className="sm:justify-center">
                  <DialogClose asChild>
                    <Button variant="destructive" className="m-4 gap-2" onClick={surrender}>
                      Yes I want to surrender !
                      <Flag />
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="secondary" onClick={handleShowTuto}>
                <BadgeHelp />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Tutorial</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <MusicButton />
              </div>
            </TooltipTrigger>
            <TooltipContent>Toggle music</TooltipContent>
          </Tooltip>
        </div>
        {isContinentMode && (
          <div className="vt323-font text-xl absolute top-0 left-1/2 transform -translate-x-1/2 z-50">
            <div>Controlling a full continent awards supply bonuses.</div>
            <div>Here are the bonuses for each continent.</div>
          </div>
        )}
        <div className={`h-[600px] w-full`}>
          <svg viewBox="0 0 1512 904" className="absolute top-0 left-0 w-full h-full" overflow="visible" id="map-svg">
            <Svg svgPath="/svgs/sea.svg" />
            <Svg svgPath="/svgs/links.svg" />
            <Svg svgPath="/svgs/map_shadows.svg" />

            <Continents containerRef={containerRef} />

            {Object.keys(nameData).map((key) => (
              <Region
                key={key}
                id={parseInt(key, 10)}
                containerRef={containerRef}
                onRegionClick={() => handleRegionClick(parseInt(key, 10))}
              />
            ))}
          </svg>
        </div>
      </div>
    </>
  );
};
export default Map;
