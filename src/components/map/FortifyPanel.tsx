import { useDojo } from '@/DojoContext';
import React, { useEffect, useState } from 'react';
import { getComponentValue } from '@latticexyz/recs';
import { useElementStore } from '@/utils/store';
import { useTileValues } from '@/hooks/useTileValue';

interface FortifyPanelProps {
  source_tileId?: number;
  target_tileId?: number;
  onCancel?: () => void;
}

const FortifyPanel: React.FC<FortifyPanelProps> = ({ source_tileId, target_tileId, onCancel }) => {
  const [armyCount, setArmyCount] = useState(0);
  const { source_tile, target_tile } = useTileValues(
    source_tileId ? source_tileId : null,
    target_tileId ? target_tileId : null
  );

  const {
    setup: {
      systemCalls: { transfer },
    },
    account: { account },
  } = useDojo();

  const { ip } = useElementStore((state) => state);

  const increment = () => setArmyCount((count) => count + 1);
  const decrement = () => setArmyCount((count) => (count > 0 ? count - 1 : 0));

  //   const [source_tile, setsource_tile] = useState(null);
  //   const [target_tile, settarget_tile] = useState(null);

  useEffect(() => {
    console.log('source_tile', source_tile);
    console.log('target_tile', target_tile);
    // useTileValues(source_tileId ? source_tileId : null, target_tileId ? target_tileId : null);
  }, [source_tileId, target_tileId]);

  useEffect(() => {
    console.log('source_tile', source_tile);
    console.log('target_tile', target_tile);
  }, [source_tile, target_tile]);
  //   useEffect(() => {
  //     console.log('IMPORTAZNT', source_tile);
  //     if (source_tileId) {
  //       const tile1Data = getComponentValue(Tile, source_tileId);
  //       console.log('source_tile', tile1Data);
  //       console.log(source_tileId);
  //       setsource_tile(tile1Data);
  //     } else {
  //       setsource_tile(null);
  //     }

  //     if (target_tileId) {
  //       const tile2Data = getComponentValue(Tile, target_tileId);
  //       settarget_tile(tile2Data);
  //     } else {
  //       settarget_tile(null);
  //     }
  //   }, [Tile, source_tileId, target_tileId]);

  const onMoveTroups = async () => {
    // TODO: Implement move troups logic
    if (source_tile === null || target_tile === null) return;

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
    console.log('source_tile', source_tile);
    console.log('target_tile', target_tile);
    console.log('armyCount', armyCount);
    if (!ip) return;
    await transfer(account, ip.toString(), source_tile, target_tile, armyCount);
    console.log('TRANSFER DOOONNNEE');
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-200 rounded-lg shadow-md">
      {/* Tile selection 1 */}
      <div className="flex items-center justify-between w-40 p-2 bg-white rounded">
        <span>{source_tile ? `Selected Region: ${source_tile}` : 'No Region selected'}</span>
        <button
          onClick={onCancel}
          className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full"
        >
          ✕
        </button>
      </div>

      {/* Army adjust */}
      <div className="flex items-center justify-center my-4">
        <button onClick={decrement} className="px-4 py-2 bg-gray-300 rounded-l">
          -
        </button>
        <div className="px-4 py-2 bg-white">{armyCount}</div>
        <button onClick={increment} className="px-4 py-2 bg-gray-300 rounded-r">
          +
        </button>
      </div>

      {/* Tile selection 2 */}
      <div className="flex items-center justify-between w-40 p-2 bg-white rounded">
        <span>{target_tile ? `Selected Region: ${target_tile}` : 'No Region selected'}</span>
        <button
          onClick={onCancel}
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
