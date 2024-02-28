import infantry from '../assets/cardassets/infantry.png';
import cavalry from '../assets/cardassets/cavalry.png'; // Replace with the actual path to your image
import artilery from '../assets/cardassets/artillery.png'; // Replace with the actual path to your image
import { CardType } from '@/utils/cards';

const cardImages: { [key: number]: string } = {
  1: infantry,
  2: cavalry,
  3: artilery,
};

const GameCard = ({ card }: { card: CardType }) => {
  const cardImage = cardImages[card];

  return (
    <div className="w-32 h-48 bg-white border-2 border-stone-900 rounded-lg shadow-lg flex items-center justify-center overflow-hidden">
      {cardImage && <img src={cardImage} alt={`Card number ${card}`} />}
    </div>
  );
};

export default GameCard;
