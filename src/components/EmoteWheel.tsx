import { useState } from 'react';
import { Button } from './ui/button';
import emotes from '@/utils/emotes';

interface EmoteWheelProps {
  onSelect: (emote: number) => void;
  children: React.ReactNode;
}

const EmoteWheel: React.FC<EmoteWheelProps> = ({ onSelect, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <>
      <div onClick={toggleVisibility}>{children}</div>
      {isVisible && (
        <div className="translate-x-[30%]">
          {emotes.map((emote, index) => {
            // Calcul de la rotation pour positionner l'émoticône
            //const angle = index * (360 / emotes.length);
            // Angle is correct for 5 icons needs to be recomputed for more
            const angle = index * 30 - 150;

            // Remember that you can compose tarnsform so the order you declare them is important
            return (
              <div
                id={index.toString()}
                key={index}
                className="absolute"
                style={{
                  transform: `rotate(${angle}deg) translate(100px) rotate(${-angle}deg) translateY(-80px)`,
                }}
                onClick={(e) => onSelect(e.currentTarget.id as unknown as number)}
              >
                <Button variant="tertiary" className="w-10 h-10 rounded-xl">
                  {emote}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default EmoteWheel;
