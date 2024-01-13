import { GiSwordsEmblem } from 'react-icons/gi';

// SelectionPanel.jsx
type SelectionPanelProps = {
  title: string;
  selectedRegion: number | null;
  onRemoveSelected: () => void;
};

const SelectionPanel = ({ selectedRegion, title, onRemoveSelected }: SelectionPanelProps) => {

  const tile = undefined//useComponentValue(Tile, selectedRegion ? tileIds[selectedRegion - 1] : null);

  const troups = tile ? tile.army : 0;

  return (
    <div className="flex flex-col items-center justify-center w-40 p-2 bg-white rounded-lg shadow-md border border-gray-300 relative">
      <span>{title}</span>
      <button
        onClick={onRemoveSelected}
        className="absolute top-1 right-1 flex items-center justify-center w-[22px] h-[22px] bg-red-500 text-white rounded-full text-xs"
      >
        ✕
      </button>
      <div className="mt-2 mb-2 flex justify-center items-center">
        <div className="flex gap-2 items-center ">
          <GiSwordsEmblem />
          <p className="font-space-mono w-5">{troups}</p>
        </div>
      </div>
    </div>
  );
};

export default SelectionPanel;
