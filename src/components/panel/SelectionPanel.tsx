import { useDojo } from '@/DojoContext';
import { useComponentStates } from '@/hooks/useComponentState';
import { useElementStore } from '@/utils/store';
import { useComponentValue } from '@dojoengine/react';
import { GiSwordsEmblem } from 'react-icons/gi';

// SelectionPanel.jsx
type SelectionPanelProps = {
  title: string;
  selectedRegion: number | null;
  onRemoveSelected: () => void;
};

const SelectionPanel = ({ selectedRegion, title, onRemoveSelected }: SelectionPanelProps) => {
  const {
    setup: {
      clientComponents: { Tile },
    },
  } = useDojo();

  const { current_state } = useElementStore((state) => state);

  const { tileIds, currentPlayerId } = useComponentStates();

  const tile = useComponentValue(Tile, selectedRegion ? tileIds[selectedRegion - 1] : null);

  const troups = tile ? tile.army : 0;

  return (
    <div className="flex flex-col items-center justify-center w-40 p-2 bg-white rounded-lg drop-shadow-lg relative border-2 border-white">
      <span>{title}</span>
      <button
        onClick={onRemoveSelected}
        className="absolute top-1 right-1 flex items-center justify-center w-[22px] h-[22px] bg-red-500 text-white rounded-full text-xs"
      >
        ✕
      </button>
      <div className="mt-2 mb-2 flex justify-center items-center">
        <div className="flex gap-2 items-center ">
          <GiSwordsEmblem className="text-xl" />
          <p className="font-space-mono text-xl w-5">{troups}</p>
        </div>
      </div>
    </div>
  );
};

export default SelectionPanel;
