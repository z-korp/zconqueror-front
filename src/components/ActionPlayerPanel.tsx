interface ActionPlayerPanelProps {
  toggleCardMenu: () => void;
  cards: number[];
}

// Composant pour la fenêtre contextuelle des cartes
const ActionPlayerPanel = ({ toggleCardMenu, cards }: ActionPlayerPanelProps) => {
  return (
    <div
      className="mx-2 pointer-events-auto"
      onClick={() => {
        toggleCardMenu();
      }}
    >
      <button className="w-[3em] h-[4.2em] relative flex col justify-center bg-black bg-opacity-30 backdrop-blur-md rounded-lg border-2 border-primary drop-shadow-lg hover:transform hover:-translate-y-1 transition-transform ease-in-out">
        <div className="text-white absolute top-1">{cards.length}</div>
        <div className="w-[0.4em] h-[1.4em] absolute top-8 left-4 border border-slate-700 drop-shadow transform -rotate-12 bg-white text-black px-2 py-1 rounded"></div>
        <div className="w-[0.4em] h-[1.4em] absolute top-9 left-3 border border-slate-700 drop-shadow transform -rotate-12 bg-white text-black px-2 py-1 rounded"></div>
      </button>
    </div>
  );
};

export default ActionPlayerPanel;
