interface ActionPlayerPanelProps {
  toggleCardMenu: () => void;
  cards: number[];
}

// Composant pour la fenêtre contextuelle des cartes
const ActionPlayerPanel = ({ toggleCardMenu, cards }: ActionPlayerPanelProps) => {
  return (
    <div className="flex relative items-center">
      <div
        className="mx-10 pointer-events-auto"
        onClick={() => {
          toggleCardMenu();
        }}
      >
        <button className="w-[58px] h-[75px] relative flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-md rounded-lg border-2 border-primary drop-shadow-lg hover:transform hover:-translate-y-1 transition-transform ease-in-out ">
          <div className="w-7 h-9 absolute top-4 left-4 border border-slate-700 drop-shadow-lg transform -rotate-12 bg-white text-black px-2 py-1 rounded"></div>
          <div className="w-7 h-9 absolute top-5 left-3 border border-slate-700 drop-shadow-lg transform -rotate-12 bg-white text-black px-2 py-1 rounded">
            {cards.length}
          </div>
        </button>
      </div>
    </div>
  );
};

export default ActionPlayerPanel;
