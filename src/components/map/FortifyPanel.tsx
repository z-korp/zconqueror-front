import { useDojo } from '@/DojoContext';
import React, { useEffect, useState } from 'react';
import { getComponentValue } from '@latticexyz/recs';
import { useElementStore } from '@/utils/store';
import { useTileValues } from '@/hooks/useTileValue';
import { useComponentStates } from '@/hooks/useComponentState';

interface FortifyPanelProps {}

const FortifyPanel: React.FC<FortifyPanelProps> = () => {
  const [armyCount, setArmyCount] = useState(0);
  const { current_fortifier, set_current_fortified, current_fortified, set_current_fortifier } = useElementStore(
    (state) => state
  );

  const {
    setup: {
      systemCalls: { transfer },
      components: { Tile },
    },
    account: { account },
  } = useDojo();

  const { ip } = useElementStore((state) => state);

  const increment = () => {
    if (sourceTile && armyCount < sourceTile.army) {
      setArmyCount(armyCount + 1);
    }
  };

  const decrement = () => {
    if (armyCount > 1) {
      setArmyCount(armyCount - 1);
    }
  };

  const [sourceTile, setSourceTile] = useState<any | null>(null);
  const [targetTile, setTargetTile] = useState<any | null>(null);

  const { tileIds } = useComponentStates();

  useEffect(() => {
    if (current_fortifier !== undefined) {
      const sourceTileData = getComponentValue(Tile, tileIds[current_fortifier - 1]);
      setSourceTile(sourceTileData);
    } else {
      setSourceTile(null);
    }

    if (current_fortified !== undefined) {
      const targetTileData = getComponentValue(Tile, tileIds[current_fortified - 1]);
      setTargetTile(targetTileData);
    } else {
      setTargetTile(null);
    }
    console.log('sourceTile after', sourceTile);
  }, [current_fortifier, current_fortified, Tile, tileIds]);

  const onMoveTroups = async () => {
    // TODO: Implement move troups logic
    if (current_fortifier === undefined || current_fortified === undefined) return;

    // fn transfer(
    //     self: @TContractState,
    //     world: IWorldDispatcher,
    //     account: felt252,
    //     source_index: u8,
    //     target_index: u8,
    //     army: u32
    // );

    //LOG ALL THE VAR USED IN TRANSFER FUNCTION
    // console.log('account', account);
    // console.log('ip', ip);
    console.log('current_fortifier', current_fortifier);
    console.log('current_fortified', current_fortified);
    console.log('armyCount', armyCount);
    if (!ip) return;
    await transfer(account, ip.toString(), current_fortifier, current_fortified, armyCount);
    console.log('TRANSFER DOOONNNEE');
  };

  const removeSelected = (arg0: number): void => {
    if (arg0 === 1) {
      set_current_fortifier(undefined);
    } else if (arg0 === 2) {
      set_current_fortified(undefined);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-200 rounded-lg shadow-md">
      {/* Tile selection 1 */}
      <div className="flex items-center justify-between w-40 p-2 bg-white rounded">
        <span>{current_fortifier ? `Selected Region: ${current_fortifier}` : 'No Region selected'}</span>
        <button
          onClick={() => removeSelected(1)}
          className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full"
        >
          ✕
        </button>
      </div>

      {/* Army adjust */}
      <div className="flex items-center justify-center my-4">
        <button onClick={decrement} className="px-4 py-2 bg-gray-300 rounded-l" disabled={armyCount <= 1}>
          -
        </button>
        <div className="px-4 py-2 bg-white">{armyCount}</div>
        <button
          onClick={increment}
          className="px-4 py-2 bg-gray-300 rounded-r"
          disabled={!sourceTile || armyCount >= sourceTile.army}
        >
          +
        </button>
      </div>

      {/* Tile selection 2 */}
      <div className="flex items-center justify-between w-40 p-2 bg-white rounded">
        <span>{current_fortified ? `Selected Region: ${current_fortified}` : 'No Region selected'}</span>
        <button
          onClick={() => removeSelected(2)}
          className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full"
        >
          ✕
        </button>
      </div>

      {/* Move troops button */}
      <button onClick={onMoveTroups} className="w-32 py-2 mt-4 text-white bg-blue-500 rounded">
        Move Troops
      </button>
    </div>
  );
};

export default FortifyPanel;
