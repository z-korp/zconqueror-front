import { useGame } from '@/hooks/useGame';
import GameCard from './GameCard';
import { useDojo } from '@/dojo/useDojo';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

interface CardMenuProps {
  cards: number[];
  onClose: () => void;
}

const CardMenu = ({ onClose, cards }: CardMenuProps) => {
  const {
    setup: {
      client: { play },
    },
    account: { account },
  } = useDojo();

  const { game } = useGame();

  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [pendingCards, setPendingCards] = useState<number[]>([]);

  useEffect(() => {
    setPendingCards(cards);
  }, [cards]);

  const discardCards = () => {
    if (game.id !== undefined && game.id !== null) {
      play.discard(account, game.id, selectedCards[0], selectedCards[1], selectedCards[2]);
      setSelectedCards([]);
    }
  };

  const handleCardSelect = (cardNumber: number) => {
    if (selectedCards.includes(cardNumber)) {
      setSelectedCards(selectedCards.filter((c) => c !== cardNumber));
      setPendingCards([...pendingCards, cardNumber]);
    } else if (selectedCards.length < 3) {
      //logique pour ne pas selectionner une 3 eme carte qui empeche le discard
      if (selectedCards.length == 2) {
        const card1 = (selectedCards[0] % 3) + 1;
        const card2 = (selectedCards[1] % 3) + 1;
        const card3 = (cardNumber % 3) + 1;
        if (card1 == card2) {
          if (card1 != card3) return;
        } else {
          if (card1 == card3 || card2 == card3) return;
        }
      }
      setSelectedCards([...selectedCards, cardNumber]);
      setPendingCards(pendingCards.filter((c) => c !== cardNumber));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 vt323-font">
      <div className="relative bg-stone-700 border-2 border-stone-900 p-6 rounded-lg shadow-lg text-center pointer-events-auto">
        <Button
          onClick={onClose}
          className="absolute top-2 right-2 flex items-center justify-center w-[22px] h-[22px] p-1 bg-red-500 text-white rounded-full text-xs"
        >
          ✕
        </Button>
        <div className="max-w-xl text-white mb-4 mx-auto">
          <p className="text-2xl">Here are your cards my Lord.</p>
          <p>
            Combine any three cards to receive supplies - merge three identical cards, or three different ones. Choose
            wisely to strengthen your realm!
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          {pendingCards.length === 0 && <div className="w-32 h-48 bg-stone-600 rounded-lg shadow-lg"></div>}
          {pendingCards.map((cardNumber, index) => (
            <div key={index} onClick={() => handleCardSelect(cardNumber)}>
              <GameCard cardNumber={cardNumber} />
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-4 ">
          {[1, 2, 3].map((index) =>
            selectedCards.length >= index ? (
              <div key={index} onClick={() => handleCardSelect(selectedCards[index - 1])}>
                <GameCard cardNumber={selectedCards[index - 1]} />
              </div>
            ) : (
              <div key={index} className="w-32 h-48 bg-stone-600 rounded-lg shadow-lg"></div>
            )
          )}
        </div>
        <Button
          disabled={selectedCards.length < 3}
          onClick={discardCards}
          className="w-32 py-2 m-4 text-white drop-shadow-lg bg-green-500 rounded hover:bg-green-600 hover:transform hover:-translate-y-1 transition-transform ease-in-out"
        >
          EXCHANGE
        </Button>
      </div>
    </div>
  );
};

export default CardMenu;
