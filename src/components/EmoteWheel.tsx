import { useState } from 'react';
import { Button } from './ui/button';

const emotes = ['🙅', '😂', '😡', '😈', '😎'];

const EmoteWheel = ({ onSelect, children }) => {
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
            const angle = index * 30 - 150;
            return (
              <div
                key={index}
                className="absolute"
                style={{
                  transform: `rotate(${angle}deg) translate(100px) rotate(${-angle}deg) translateY(-80px)`,
                }}
                onClick={() => onSelect(emote)}
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
