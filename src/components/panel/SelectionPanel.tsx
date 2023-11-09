// SelectionPanel.jsx
type SelectionPanelProps = {
  selectedRegion: number | undefined;
  onRemoveSelected: (type: number) => void;
  type: number;
};

const SelectionPanel = ({ selectedRegion, onRemoveSelected, type }: SelectionPanelProps) => {
  return (
    <div className="flex items-center justify-between w-40 p-2 bg-white rounded">
      <span>{selectedRegion ? `Selected Region: ${selectedRegion}` : 'No Region selected'}</span>
      <button
        onClick={() => onRemoveSelected(type)}
        className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-full"
      >
        ✕
      </button>
    </div>
  );
};

export default SelectionPanel;
