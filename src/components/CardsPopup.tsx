import { CardType } from '@/utils/cards';
import GameCard from './GameCard';
import { Button } from './ui/button';

interface CardsPopupProps {
  cards: CardType[];
  onClose: () => void;
}

// Composant pour la fenêtre contextuelle des cartes
const CardsPopup: React.FC<CardsPopupProps> = ({ cards, onClose }) => {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 vt323-font text-2xl text-white">
      <div className="relative bg-stone-700 border-2 border-stone-900 p-6 rounded-lg shadow-lg text-center pointer-events-auto">
        <Button
          onClick={onClose}
          className="absolute top-2 right-2 flex items-center justify-center p-1 w-[22px] h-[22px] bg-red-500 text-white rounded-full text-xs"
        >
          ✕
        </Button>

        <div className="max-w-md text-white mb-4">
          <p className="text-2xl">Congratulations!</p>
          <p className="text-lg">
            Your successful conquests have earned you this card. Use it wisely to fortify your dominion.
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          {cards.length > 0 && <GameCard card={cards[cards.length - 1]} />}
        </div>
      </div>
    </div>
  );
};

export default CardsPopup;
