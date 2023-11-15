import React, { useEffect, useRef, useState } from 'react';
import { useDojo } from '@/DojoContext';
import { getComponentValue } from '@latticexyz/recs';
import { useElementStore } from '@/utils/store';
import { useComponentStates } from '@/hooks/useComponentState';
import SelectionPanel from '../panel/SelectionPanel';
import Counter from '../panel/Counter';
import { useComponentValue } from '@dojoengine/react';
import { GiMountedKnight } from 'react-icons/gi';
import Arrow from './Arrow';

const FortifyPanel = () => {
  const [armyCount, setArmyCount] = useState(0);
  const {
    current_fortifier,
    set_current_fortified,
    current_fortified,
    set_current_fortifier,
    current_attacker,
    current_defender,
    current_state,
  } = useElementStore((state) => state);

  const {
    setup: {
      systemCalls: { transfer, attack, defend },
      components: { Tile, Player },
    },
    account: { account },
  } = useDojo();

  const { currentPlayerId } = useComponentStates();
  const player = useComponentValue(Player, currentPlayerId);

  const { ip } = useElementStore((state) => state);
  const [sourceTile, setSourceTile] = useState<any | null>(null);
  const [attackerTile, setAttackerTile] = useState<any | null>(null);
  const [targetTile, setTargetTile] = useState<any | null>(null);

  const [arrowPosition, setArrowPosition] = useState({ x: 0, y: 0, visible: false });

  // Example positions, you'll need to calculate these based on your game's grid
  const attackerPosition = { x: 125, y: 150 }; // Replace with actual position
  const defenderPosition = { x: 125, y: 300 }; // Replace with actual position

  // Trigger the animation on some game event, e.g., attack
  const animateArrow = () => {
    let start = null;
    const duration = 1000; // Duration of animation in milliseconds

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = (timestamp - start) / duration;
      const currentX = attackerPosition.x + progress * (defenderPosition.x - attackerPosition.x);
      const currentY = attackerPosition.y + progress * (defenderPosition.y - attackerPosition.y);

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
  }, [current_state]);

  const sourceIconRef = useRef<HTMLDivElement>(null);
  const targetIconRef = useRef<HTMLDivElement>(null);

  const increment = () => {
    if (attackerTile && armyCount < attackerTile.army - 1) {
      setArmyCount(armyCount + 1);
    }
    if (sourceTile && armyCount < sourceTile.army - 1) {
      setArmyCount(armyCount + 1);
    }
  };

  const decrement = () => {
    if (armyCount > 1) {
      setArmyCount(armyCount - 1);
    }
  };

  const { tileIds } = useComponentStates();

  useEffect(() => {
    if (current_attacker !== undefined) {
      const attackerTile = getComponentValue(Tile, tileIds[current_attacker - 1]);

      setAttackerTile(attackerTile);
      if (attackerTile && attackerTile.army) {
        setArmyCount(attackerTile.army - 1);
      }
    }
  }, [current_attacker, Tile, tileIds]);

  useEffect(() => {
    if (current_fortifier !== undefined) {
      const sourceTileData = getComponentValue(Tile, tileIds[current_fortifier - 1]);
      setSourceTile(sourceTileData);
      if (sourceTileData && sourceTileData.army) {
        setArmyCount(sourceTileData.army - 1);
      }
    } else {
      setSourceTile(null);
    }

    if (current_fortified !== undefined) {
      const targetTileData = getComponentValue(Tile, tileIds[current_fortified - 1]);
      setTargetTile(targetTileData);
    } else {
      setTargetTile(null);
    }
  }, [current_fortifier, current_fortified, Tile, tileIds]);

  const onMoveTroops = async () => {
    if (current_fortifier === undefined || current_fortified === undefined) return;

    if (!ip) return;
    animateArrow();
    await transfer(account, ip.toString(), current_fortifier, current_fortified, armyCount);
  };

  const onAttack = async () => {
    // Implement attack logic here
    if (current_attacker === undefined || current_defender === undefined) return;

    if (!ip) return;

    // todo adapt to compare to attacker.supply
    if (player && player.attack < armyCount) {
      //todo put toast here
      alert('Not enough attack');
      return;
    }

    animateArrow();

    await attack(account, ip.toString(), current_attacker, current_defender, armyCount);
    defend(account, ip.toString(), current_attacker, current_defender);
  };

  const removeSelected = (type: number): void => {
    if (type === 1) {
      set_current_fortifier(undefined);
    } else if (type === 2) {
      set_current_fortified(undefined);
    }
  };

  const isAttackTurn = () => {
    return current_state === 2; // Assuming '2' is the state for attack turns
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-200 rounded-lg shadow-md">
      {isAttackTurn() ? (
        <>
          <div className="bg-white rounded-lg">
            <SelectionPanel selectedRegion={current_attacker} onRemoveSelected={removeSelected} type={1} />
            <div className="mt-2 mb-2 flex justify-center items-center">
              <div ref={sourceIconRef} className="icon">
                <GiMountedKnight className="text-4xl" />
              </div>
            </div>
          </div>

          <Counter
            count={armyCount}
            onDecrement={decrement}
            onIncrement={increment}
            maxCount={sourceTile ? sourceTile.army - 1 : Infinity}
          />
          <div className="bg-white rounded-lg">
            <SelectionPanel selectedRegion={current_defender} onRemoveSelected={removeSelected} type={2} />
            <div className="mt-2 mb-2 flex justify-center items-center">
              <div ref={sourceIconRef} className="icon">
                <GiMountedKnight className="text-4xl" />
              </div>
            </div>
          </div>
          <button onClick={onAttack} className="w-32 py-2 mt-4 text-white bg-red-500 rounded">
            Attack
          </button>
          {arrowPosition.visible && <Arrow position={arrowPosition} />}
        </>
      ) : (
        <>
          {/* Fortify UI elements here */}
          {/* <div className="flex items-center justify-between w-40 p-2 bg-white rounded"> */}
          <div className="bg-white rounded-lg">
            <SelectionPanel selectedRegion={current_fortifier} onRemoveSelected={removeSelected} type={1} />
            <div className="mt-2 mb-2 flex justify-center items-center">
              <GiMountedKnight className="text-4xl" />
            </div>
          </div>
          {/* Use Counter for armyCount */}
          <Counter
            count={armyCount}
            onDecrement={decrement}
            onIncrement={increment}
            maxCount={sourceTile ? sourceTile.army - 1 : Infinity}
          />

          {/* Use SelectionPanel for current_fortified */}
          <div className="bg-white rounded-lg">
            <SelectionPanel selectedRegion={current_fortified} onRemoveSelected={removeSelected} type={2} />
            {/* </div> */}
            <div className="mt-2 mb-2 flex justify-center items-center">
              <GiMountedKnight className="text-4xl" />
            </div>
          </div>
          <button onClick={onMoveTroops} className="w-32 py-2 mt-4 text-white bg-blue-500 rounded">
            Move Troops
          </button>
        </>
      )}
    </div>
  );
};

export default FortifyPanel;
