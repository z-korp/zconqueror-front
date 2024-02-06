import GameCard from './GameCard';

// Composant pour la fenêtre contextuelle des cartes
const CardsPopup = ({ cards, onClose }) => {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50">
      <div className="p-8 bg-white rounded shadow-lg text-center">
        <p>You won this card:</p>
        <div className="flex justify-center space-x-4 mb-4">
          {cards.length > 0 && <GameCard cardNumber={cards[cards.length - 1]} />}
        </div>
        <button onClick={onClose} className="mt-4">
          Close
        </button>
      </div>
    </div>
  );
};

export default CardsPopup;
