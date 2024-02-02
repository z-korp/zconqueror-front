import { useDojo } from '@/DojoContext';
import { useComponentStates } from '@/hooks/useComponentState';
import { Phase, useElementStore } from '@/utils/store';
import { useComponentValue } from '@dojoengine/react';
import { getComponentValue } from '@latticexyz/recs';
import { useEffect, useState } from 'react';
import Counter from '../panel/Counter';
import SelectionPanel from '../panel/SelectionPanel';
import { ShieldPlus, Swords, Milestone } from 'lucide-react';

const FortifyPanel = () => {
  const [armyCount, setArmyCount] = useState(0);
  const [isActionSelected, setIsActionSelected] = useState(false);
  const { current_source, set_current_source, current_target, set_current_target, current_state, game_id } =
    useElementStore((state) => state);

  const {
    setup: {
      client: { play },
      clientComponents: { Tile, Player },
    },
    account: { account },
  } = useDojo();

  const { currentPlayerId } = useComponentStates();
  const player = useComponentValue(Player, currentPlayerId);

  const { current_address } = useElementStore((state) => state);
  const [sourceTile, setSourceTile] = useState<any | null>(null);
  const [targetTile, setTargetTile] = useState<any | null>(null);

  const [arrowPosition, setArrowPosition] = useState({
    x: 0,
    y: 0,
    visible: false,
  });

  // Example positions, you'll need to calculate these based on your game's grid
  const attackerPosition = { x: 125, y: 150 }; // Replace with actual position
  const targetPosition = { x: 125, y: 300 }; // Replace with actual position

  // Trigger the animation on some game event, e.g., attack
  const animateArrow = () => {
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
  };

  useEffect(() => {
    // Reset the armyCount state to 0 when current_state changes
    setArmyCount(0);
    set_current_source(null);
    set_current_target(null);
  }, [current_state]);

  const increment = () => {
    if (current_state === Phase.DEPLOY) {
      if (armyCount <= player.supply) {
        setArmyCount(armyCount + 1);
      }
    } else {
      if (sourceTile && armyCount < sourceTile.army - 1) {
        setArmyCount(armyCount + 1);
      }
    }
  };

  const decrement = () => {
    if (armyCount > 1) {
      setArmyCount(armyCount - 1);
    }
  };

  const { tileIds } = useComponentStates();

  useEffect(() => {
    if (current_source !== null) {
      const sourceTileData = getComponentValue(Tile, tileIds[current_source - 1]);
      setSourceTile(sourceTileData);
      if (sourceTileData && sourceTileData.army) {
        if (current_state === Phase.DEPLOY) {
          setArmyCount(player.supply);
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
      const targetTileData = getComponentValue(Tile, tileIds[current_target - 1]);
      setTargetTile(targetTileData);
    } else {
      setTargetTile(null);
    }
  }, [current_source, current_target, Tile, tileIds]);

  const handleSupply = () => {
    if (game_id == null || game_id == undefined) return;
    if (current_source === null) return;
    if (player && player.supply < armyCount) {
      //todo put toast here
      console.log('Not enough supply', player.supply, armyCount);
      // alert('Not enough supply', player.supply);
      return;
    }
    play.supply(account, game_id, current_source, armyCount);
    setArmyCount(player.supply - armyCount);
  };

  const onMoveTroops = async () => {
    if (current_source === null || current_target === null) return;

    if (game_id == null || game_id == undefined) return;
    animateArrow();
    await play.transfer(account, game_id, current_source, current_target, armyCount);
  };

  const onAttack = async () => {
    // Implement attack logic here
    if (current_source === null || current_target === null) return;

    if (game_id == null || game_id == undefined) return;

    // todo adapt to compare to source.supply
    if (player && player.attack < armyCount) {
      //todo put toast here
      alert('Not enough attack');
      return;
    }
    animateArrow();

    await play.attack(account, game_id, current_source, current_target, armyCount);

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(100);

    play.defend(account, game_id, current_source, current_target);
  };

  const removeSelected = (type: number): void => {
    if (type === 1) {
      set_current_source(null);
      set_current_target(null);
    } else if (type === 2) {
      set_current_target(null);
    }
  };

  const isAttackTurn = () => {
    return current_state === Phase.ATTACK;
  };

  const isFortifyTurn = () => {
    return current_state === Phase.FORTIFY;
  };
  console.log('current_state', current_state);
  return (
    <div
      id="parent"
      className={`flex flex-col items-center justify-center p-4 min-w-[180px] min-w-[200px] ${
        isActionSelected && 'border-4 rounded-lg border-primary bg-black bg-opacity-30 backdrop-blur-md drop-shadow-lg'
      } `}
    >
      {isAttackTurn() ? (
        current_source && (
          <>
            <SelectionPanel
              title={current_state === Phase.ATTACK ? 'Attacker' : 'Fortifier'}
              selectedRegion={current_source}
              onRemoveSelected={() => removeSelected(1)}
            />
            {current_target && (
              <>
                <Counter
                  count={armyCount}
                  onDecrement={decrement}
                  onIncrement={increment}
                  maxCount={sourceTile ? sourceTile.army - 1 : Infinity}
                />

                <SelectionPanel
                  title={current_state === Phase.ATTACK ? 'Defender' : 'Fortified'}
                  selectedRegion={current_target}
                  onRemoveSelected={() => removeSelected(2)}
                />
                <button
                  onClick={onAttack}
                  className="flex items-center justify-center w-full py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-600 drop-shadow-lg hover:transform hover:-translate-y-1 transition-transform ease-in-out"
                >
                  Attack <Swords className="ml-2" />
                </button>
              </>
            )}
          </>
        )
      ) : isFortifyTurn() ? (
        <>
          {current_source && (
            <SelectionPanel title="Origin" selectedRegion={current_source} onRemoveSelected={() => removeSelected(1)} />
          )}
          {current_target && (
            <>
              <Counter
                count={armyCount}
                onDecrement={decrement}
                onIncrement={increment}
                maxCount={sourceTile ? sourceTile.army - 1 : Infinity}
              />
              <SelectionPanel
                title="Destination"
                selectedRegion={current_target}
                onRemoveSelected={() => removeSelected(2)}
              />
              <button
                onClick={onMoveTroops}
                className="flex items-center justify-center w-full py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600 drop-shadow-lg hover:transform hover:-translate-y-1 transition-transform ease-in-out"
              >
                Move Troops <Milestone className="ml-2" />
              </button>
            </>
          )}
        </>
      ) : (
        <>
          {current_source && (
            <>
              <SelectionPanel
                title="Territory"
                selectedRegion={current_source}
                onRemoveSelected={() => removeSelected(1)}
              />
              <Counter
                count={armyCount}
                onDecrement={decrement}
                onIncrement={increment}
                maxCount={player ? player.supply : Infinity}
              />
              <button
                onClick={handleSupply}
                className="flex items-center justify-center w-full py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600 drop-shadow-lg hover:transform hover:-translate-y-1 transition-transform ease-in-out"
              >
                Deploy troops <ShieldPlus className="ml-2" />
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FortifyPanel;
