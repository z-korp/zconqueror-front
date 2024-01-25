import infantry from '../assets/cardassets/infantry.png';
import cavalry from '../assets/cardassets/cavalry.png'; // Replace with the actual path to your image
import artilery from '../assets/cardassets/artillery.png'; // Replace with the actual path to your image

const cardImages: { [key: number]: string } = {
  1: infantry,
  2: cavalry,
  3: artilery,
};

const GameCard = ({ cardNumber }: { cardNumber: number }) => {
  // Determine which image to use based on the cardNumber
  const cardImage = cardImages[cardNumber % 3];

  return (
    <div className="w-32 h-48 bg-white rounded-lg shadow-lg flex items-center justify-center overflow-hidden">
      {/* Render the image based on the cardNumber */}
      {cardImage && <img src={cardImage} alt={`Card number ${cardNumber}`} />}
    </div>
  );
};

export default GameCard;
