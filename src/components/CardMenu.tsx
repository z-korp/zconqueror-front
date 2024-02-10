import GameCard from './GameCard';

interface CardMenuProps {
  cards: number[];
  selectedCards: number[];
  isOpen: boolean;
  onSelectCard: (cardNumber: number) => void;
  onDiscard: (cardNumber: number) => void;
  onClose: () => void;
}
// Composant pour le menu de sélection et d'échange de cartes
const CardMenu = ({ cards, selectedCards, isOpen, onSelectCard, onDiscard, onClose }: CardMenuProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 vt323-font">
      <div className="relative bg-stone-700 border-2 border-stone-900 p-6 pt-10 rounded-lg shadow-lg text-center pointer-events-auto h-2/3">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 flex items-center justify-center w-[22px] h-[22px] bg-red-500 text-white rounded-full text-xs"
        >
          ✕
        </button>
        <div className="flex justify-center space-x-4 mb-4">
          {[1, 2, 3].map((index) =>
            selectedCards.length >= index ? (
              <div key={index} onClick={() => onSelectCard(selectedCards[index - 1])}>
                <GameCard cardNumber={selectedCards[index - 1]} />
              </div>
            ) : (
              <div key={index} className="w-32 h-48 bg-stone-600 rounded-lg shadow-lg shadow-inner"></div>
            )
          )}
        </div>
        <div className="flex justify-center space-x-4">
          {cards.map((cardNumber, index) => (
            <div key={index} onClick={() => onSelectCard(cardNumber)}>
              <GameCard cardNumber={cardNumber} />
            </div>
          ))}
        </div>
        <button
          onClick={onDiscard}
          className="w-32 py-2 m-4 text-white rounded-lg drop-shadow-lg bg-green-500 rounded hover:bg-green-600 hover:transform hover:-translate-y-1 transition-transform ease-in-out"
        >
          EXCHANGE
        </button>
      </div>
    </div>
  );
};

export default CardMenu;
