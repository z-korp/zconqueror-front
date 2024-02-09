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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center pointer-events-auto h-2/3">
        <div className="flex justify-center space-x-4 mb-4">
          {[1, 2, 3].map((index) =>
            selectedCards.length >= index ? (
              <div key={index} onClick={() => onSelectCard(selectedCards[index - 1])}>
                <GameCard cardNumber={selectedCards[index - 1]} />
              </div>
            ) : (
              <div key={index} className="w-32 h-48 bg-gray-200 rounded-lg shadow-md"></div>
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
          className="w-32 py-2 m-4 text-white bg-customBlue-500 rounded hover:bg-customBlue-600"
        >
          Exchange
        </button>
        <button
          onClick={onClose}
          className="w-32 py-2 m-4 text-white bg-customBlue-500 rounded hover:bg-customBlue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CardMenu;
