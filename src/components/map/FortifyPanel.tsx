import React, { useState } from 'react';

interface FortifyPanelProps {
  selectedTile1?: string;
  selectedTile2?: string;
  onCancel?: () => void;
  onMoveTroups?: () => void;
}

const FortifyPanel: React.FC<FortifyPanelProps> = ({ selectedTile1, selectedTile2, onCancel, onMoveTroups }) => {
  const [armyCount, setArmyCount] = useState(0);

  const increment = () => setArmyCount((count) => count + 1);
  const decrement = () => setArmyCount((count) => (count > 0 ? count - 1 : 0));

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-200 rounded-lg shadow-md">
      {/* Tile selection 1 */}
      <div className="flex items-center justify-between w-40 p-2 bg-white rounded">
        <span>{selectedTile1 ? `Selected Tile: ${selectedTile1}` : 'No tile selected'}</span>
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
        <span>{selectedTile2 ? `Selected Tile: ${selectedTile2}` : 'No tile selected'}</span>
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
