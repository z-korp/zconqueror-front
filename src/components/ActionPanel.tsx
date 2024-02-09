import { useDojo } from '@/DojoContext';
import { useGetCurrentPlayer } from '@/hooks/useGetCurrentPlayer';
import { useGetTiles } from '@/hooks/useGetTiles';
import { usePhase } from '@/hooks/usePhase';
import { Phase, useElementStore } from '@/utils/store';
import { Milestone, ShieldPlus, Swords } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Slider } from './ui/slider';

const ActionPanel = () => {
  const {
    setup: {
      client: { play },
    },
    account: { account },
  } = useDojo();

  const {
    current_source,
    set_current_source,
    current_target,
    set_current_target,
    game,
    set_army_count: setArmyCount,
    army_count: armyCount,
  } = useElementStore((state) => state);
  const { phase } = usePhase();
  const { currentPlayer } = useGetCurrentPlayer();
  const [sourceTile, setSourceTile] = useState<any | null>(null);
  const [targetTile, setTargetTile] = useState<any | null>(null);
  const [isActionSelected, setIsActionSelected] = useState(false);

  /*const [arrowPosition, setArrowPosition] = useState({
    x: 0,
    y: 0,
    visible: false,
  });

  const attackerPosition = { x: 125, y: 150 };
  const targetPosition = { x: 125, y: 300 };

  // Trigger the animation on some game event, e.g., attack
  /*const animateArrow = () => {
    let start: any = null;
    const duration = 1000; // Duration of animation in milliseconds

    const step = (timestamp: any) => {
      if (!start) start = timestamp;
      const progress = (timestamp - start) / duration;
      const currentX = attackerPosition.x + progress * (targetPosition.x - attackerPosition.x);
      const currentY = attackerPosition.y + progress * (targetPosition.y - attackerPosition.y);

      setArrowPosition({ x: currentX, y: currentY, visible: true });

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Hide the arrow after reaching the target
        setArrowPosition({ ...arrowPosition, visible: false });
      }
    };

    requestAnimationFrame(step);
  };*/

  useEffect(() => {
    setArmyCount(0);
    set_current_source(null);
    set_current_target(null);
  }, [phase]);

  const { tiles } = useGetTiles();

  useEffect(() => {
    if (current_source !== null) {
      const sourceTileData = tiles[current_source - 1];
      setSourceTile(sourceTileData);
      if (sourceTileData && sourceTileData.army) {
        if (phase === Phase.DEPLOY) {
          setArmyCount(currentPlayer.supply);
        } else {
          setArmyCount(sourceTileData.army - 1);
        }
      }
      setIsActionSelected(true);
    } else {
      setSourceTile(null);
      setIsActionSelected(false);
    }

    if (current_target !== null) {
      const targetTileData = tiles[current_target - 1];
      setTargetTile(targetTileData);
    } else {
      setTargetTile(null);
    }
  }, [current_source, phase, current_target]);

  const handleSupply = () => {
    if (game.id == null || game.id == undefined) return;
    if (current_source === null) return;
    if (currentPlayer && currentPlayer.supply < armyCount) {
      //todo put toast here
      console.log('Not enough supply', currentPlayer.supply, armyCount);
      // alert('Not enough supply', player.supply);
      return;
    }
    play.supply(account, game.id, current_source, armyCount);
    setArmyCount(currentPlayer.supply - armyCount);
    set_current_source(null);
  };

  const onMoveTroops = async () => {
    if (current_source === null || current_target === null) return;

    if (game.id == null || game.id == undefined) return;
    //animateArrow();
    await play.transfer(account, game.id, current_source, current_target, armyCount);
  };

  const onAttack = async () => {
    // Implement attack logic here
    if (current_source === null || current_target === null) return;

    if (game.id == null || game.id == undefined) return;

    // todo adapt to compare to source.supply
    if (currentPlayer && currentPlayer.attack < armyCount) {
      //todo put toast here
      alert('Not enough attack');
      return;
    }
    //animateArrow();

    await play.attack(account, game.id, current_source, current_target, armyCount);

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(100);

    play.defend(account, game.id, current_source, current_target);
    set_current_source(null);
  };

  const removeSelected = (): void => {
    set_current_source(null);
    set_current_target(null);
  };

  const isAttackTurn = () => {
    return phase === Phase.ATTACK;
  };

  const isFortifyTurn = () => {
    return phase === Phase.FORTIFY;
  };

  return (
    <>
      {isAttackTurn() ? (
        current_source &&
        current_target &&
        sourceTile.army > 1 && (
          <div
            id="parent"
            className={`flex items-center justify-around p-4 h-24 ${
              isActionSelected &&
              'border-4 rounded-lg border-primary bg-black bg-opacity-30 backdrop-blur-md drop-shadow-lg'
            } `}
          >
            <Slider
              className="w-32"
              min={1}
              max={sourceTile ? sourceTile.army - 1 : Infinity}
              value={[armyCount]}
              onValueChange={(newValue: number[]) => {
                setArmyCount(newValue[0]);
              }}
              color="red"
            ></Slider>
            <>
              <button
                onClick={onAttack}
                className="flex items-center justify-center h-8 px-2 text-white bg-red-500 rounded hover:bg-red-600 drop-shadow-lg hover:transform hover:-translate-y-1 transition-transform ease-in-out"
              >
                Attack <Swords className="ml-2" />
              </button>
              <button
                onClick={removeSelected}
                className="absolute top-1 right-1 flex items-center justify-center w-[22px] h-[22px] bg-red-500 text-white rounded-full text-xs"
              >
                ✕
              </button>
            </>
          </div>
        )
      ) : isFortifyTurn() ? (
        <>
          {currentPlayer && targetTile && current_source && sourceTile && sourceTile.army > 1 && current_target && (
            <div
              id="parent"
              className={`flex items-center justify-around p-4 h-24 ${
                isActionSelected &&
                'border-4 rounded-lg border-primary bg-black bg-opacity-30 backdrop-blur-md drop-shadow-lg'
              } `}
            >
              <Slider
                className="w-32"
                min={1}
                max={sourceTile.army - 1}
                value={[armyCount]}
                onValueChange={(newValue: number[]) => {
                  setArmyCount(newValue[0]);
                }}
              ></Slider>
              <button
                onClick={onMoveTroops}
                className="flex items-center justify-center h-8 px-2 text-white bg-green-500 rounded hover:bg-green-600 drop-shadow-lg hover:transform hover:-translate-y-1 transition-transform ease-in-out"
              >
                Move Troops
                <Milestone className="ml-2" />
              </button>
              <button
                onClick={removeSelected}
                className="absolute top-1 right-1 flex items-center justify-center w-[22px] h-[22px] bg-red-500 text-white rounded-full text-xs"
              >
                ✕
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {currentPlayer && sourceTile && current_source && currentPlayer.supply > 0 && (
            <div
              id="parent"
              className={`flex items-center justify-around p-4 h-24 ${
                isActionSelected &&
                'border-4 rounded-lg border-primary bg-black bg-opacity-30 backdrop-blur-md drop-shadow-lg'
              } `}
            >
              <Slider
                className="w-32"
                min={1}
                max={currentPlayer.supply}
                value={[armyCount]}
                onValueChange={(newValue: number[]) => {
                  setArmyCount(newValue[0]);
                }}
              ></Slider>
              <button
                onClick={handleSupply}
                className="flex items-center justify-center h-8 px-2  text-white bg-green-500 rounded hover:bg-green-600 drop-shadow-lg hover:transform hover:-translate-y-1 transition-transform ease-in-out"
              >
                Deploy Troops <ShieldPlus className="ml-2" />
              </button>
              <button
                onClick={removeSelected}
                className="absolute top-1 right-1 flex items-center justify-center w-[22px] h-[22px] bg-red-500 text-white rounded-full text-xs"
              >
                ✕
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};
export default ActionPanel;
