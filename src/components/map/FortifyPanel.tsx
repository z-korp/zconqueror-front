import { useDojo } from '@/DojoContext';
import { useComponentStates } from '@/hooks/useComponentState';
import { Phase, useElementStore } from '@/utils/store';
import { useComponentValue } from '@dojoengine/react';
import { getComponentValue } from '@latticexyz/recs';
import { useEffect, useState } from 'react';
import Counter from '../panel/Counter';
import SelectionPanel from '../panel/SelectionPanel';

const FortifyPanel = () => {
  const [armyCount, setArmyCount] = useState(0);
  const { current_source, set_current_target, current_target, set_current_source, current_state } = useElementStore(
    (state) => state
  );

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
  const [targetTile, setTargetTile] = useState<any | null>(null);

  const increment = () => {
    if (sourceTile && armyCount < sourceTile.army - 1) {
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
    if (current_source !== undefined) {
      const sourceTile = getComponentValue(Tile, tileIds[current_source - 1]);
      setSourceTile(sourceTile);
    }
  }, [current_source, Tile, tileIds]);

  useEffect(() => {
    if (current_source !== undefined) {
      const sourceTileData = getComponentValue(Tile, tileIds[current_source - 1]);
      setSourceTile(sourceTileData);
    } else {
      setSourceTile(null);
    }

    if (current_target !== undefined) {
      const targetTileData = getComponentValue(Tile, tileIds[current_target - 1]);
      setTargetTile(targetTileData);
    } else {
      setTargetTile(null);
    }
  }, [current_source, current_target, Tile, tileIds]);

  const onMoveTroops = async () => {
    if (current_source === undefined || current_target === undefined) return;

    if (!ip) return;

    await transfer(account, ip.toString(), current_source, current_target, armyCount);
  };

  const onAttack = async () => {
    // Implement attack logic here
    if (current_source === undefined || current_target === undefined) return;

    if (!ip) return;

    // todo adapt to compare to source.supply
    if (player && player.attack < armyCount) {
      //todo put toast here
      alert('Not enough attack');
      return;
    }

    await attack(account, ip.toString(), current_source, current_target, armyCount);
    defend(account, ip.toString(), current_source, current_target);
    // TODO: Call the attack function from your game logic or smart contract
  };

  const removeSelected = (type: number): void => {
    if (type === 1) {
      set_current_source(null);
    } else if (type === 2) {
      set_current_target(null);
    }
  };

  const isAttackTurn = () => {
    return current_state === Phase.ATTACK;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-200 rounded-lg shadow-md">
      {isAttackTurn() ? (
        <>
          <SelectionPanel selectedRegion={current_source} onRemoveSelected={removeSelected} type={1} />

          <Counter
            count={armyCount}
            onDecrement={decrement}
            onIncrement={increment}
            maxCount={sourceTile ? sourceTile.army - 1 : Infinity}
          />

          <SelectionPanel selectedRegion={current_target} onRemoveSelected={removeSelected} type={2} />

          <button onClick={onAttack} className="w-32 py-2 mt-4 text-white bg-red-500 rounded">
            Attack
          </button>
        </>
      ) : (
        <>
          {/* Fortify UI elements here */}
          {/* <div className="flex items-center justify-between w-40 p-2 bg-white rounded"> */}
          <SelectionPanel selectedRegion={current_source} onRemoveSelected={removeSelected} type={1} />

          {/* Use Counter for armyCount */}
          <Counter
            count={armyCount}
            onDecrement={decrement}
            onIncrement={increment}
            maxCount={sourceTile ? sourceTile.army - 1 : Infinity}
          />

          {/* Use SelectionPanel for current_target */}
          <SelectionPanel selectedRegion={current_target} onRemoveSelected={removeSelected} type={2} />
          {/* </div> */}

          <button onClick={onMoveTroops} className="w-32 py-2 mt-4 text-white bg-blue-500 rounded">
            Move Troops
          </button>
        </>
      )}
    </div>
  );
};

export default FortifyPanel;
