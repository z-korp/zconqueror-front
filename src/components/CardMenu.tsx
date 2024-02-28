import { useGame } from '@/hooks/useGame';
import GameCard from './GameCard';
import { useDojo } from '@/dojo/useDojo';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { CardType } from '@/utils/cards';

interface CardMenuProps {
  cards: CardType[];
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

  const handleCardSelect = (card: CardType) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter((c) => c !== card));
    } else if (selectedCards.length < 3) {
      // logique pour ne pas selectionner une 3 eme carte qui empeche le discard
      if (selectedCards.length == 2) {
        const card1 = selectedCards[0];
        const card2 = selectedCards[1];
        const card3 = card;
        if (card1 == card2) {
          if (card1 != card3) return;
        } else {
          if (card1 == card3 || card2 == card3) return;
        }
      }
      setSelectedCards([...selectedCards, card]);
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

        <div className="flex justify-center  mb-4">
          {[1, 2, 3, 4, 5].map((index) => {
            const rotationDegree = (index - 3) * 10; // Adjust rotation degree here
            const translateY = Math.abs(index - 3) * 20; // Adjust translation here
            // const translateY = Math.abs(index - 3) * 10; // Adjust translation here

            return pendingCards.length >= index ? (
              <div
                key={index}
                onClick={() => handleCardSelect(pendingCards[index - 1])}
                style={{
                  transform: `rotate(${rotationDegree}deg) translateY(${translateY}px)`,
                  transition: 'transform 0.3s',
                }}
                className="transform-gpu"
              >
                {selectedCards.includes(pendingCards[index - 1]) && (
                  <div className="absolute top-0 right-0 p-1 w-5 h-5 m-2 bg-green-500 text-lg text-white rounded-full flex items-center justify-center">
                    ✓
                  </div>
                )}
                <GameCard card={pendingCards[index - 1]} />
              </div>
            ) : (
              <div
                key={index}
                className="w-32 h-48 bg-stone-600 rounded-lg shadow-lg border border-white"
                style={{
                  transform: `rotate(${rotationDegree}deg) translateY(${translateY}px)`,
                  transition: 'transform 0.3s',
                }}
              ></div>
            );
          })}
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
