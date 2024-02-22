import { Button } from './ui/button';

interface CardPanelButtonProps {
  toggleCardMenu: () => void;
  cards: number[];
}

// Composant pour la fenêtre contextuelle des cartes
const CardPanelButton = ({ toggleCardMenu, cards }: CardPanelButtonProps) => {
  return (
    <div
      className="mx-2 pointer-events-auto"
      onClick={() => {
        toggleCardMenu();
      }}
    >
      <Button className="w-[3em] h-[4.2em] relative flex col p-0 justify-center bg-black bg-opacity-30 backdrop-blur-md rounded-lg border-2 border-primary drop-shadow-lg hover:transform hover:-translate-y-1 transition-transform ease-in-out">
        <div className="text-white absolute top-1 vt323-font text-2xl -mt-1">{cards.length}</div>
        <div className="w-[0.3em] h-[1.2em] absolute top-7 left-3 border border-slate-700 drop-shadow transform -rotate-12 bg-white text-black px-2 py-1 rounded"></div>
        <div className="w-[0.3em] h-[1.2em] absolute top-8 left-2 border border-slate-700 drop-shadow transform -rotate-12 bg-white text-black px-2 py-1 rounded"></div>
      </Button>
    </div>
  );
};

export default CardPanelButton;
