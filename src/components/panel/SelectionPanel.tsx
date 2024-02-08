import { useGetTiles } from '@/hooks/useGetTiles';
import { GiSwordsEmblem } from 'react-icons/gi';

// SelectionPanel.jsx
interface SelectionPanelProps {
  title: string;
  selectedRegion: number | null;
  onRemoveSelected: () => void;
}

const SelectionPanel = ({ selectedRegion, title, onRemoveSelected }: SelectionPanelProps) => {
  const { tiles } = useGetTiles();

  const tile = selectedRegion ? tiles[selectedRegion - 1] : null;

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
