import React, { useEffect, useState } from 'react';
import { ArrowBigDown } from 'lucide-react';
import { useMe } from '@/hooks/useMe';
import { avatars } from '@/utils/pfps';
import Bubble from './Bubble';

interface OverlayTutoProps {
  texts: string[];
  onClose: () => void;
  top: number;
  left: number;
  height: number;
  width: number;
  radius: number;
  handleNextStep: () => void;
}

const OverlayTuto: React.FC<OverlayTutoProps> = ({
  texts,
  onClose,
  top,
  left,
  width,
  height,
  radius,
  handleNextStep,
}) => {
  const { me } = useMe();
  const [showOverlay, setShowOverlay] = useState<boolean>(true);

  useEffect(() => {
    // Check if the overlay has been shown before
    const hasOverlayBeenShown = localStorage.getItem('hasOverlayBeenShown');
    if (!hasOverlayBeenShown) {
      // If not, set the flag in local storage and show the overlay
      localStorage.setItem('hasOverlayBeenShown', 'true');
      //setShowOverlay(false);
    }
  }, []);

  const arrowTop = top - 0;
  const arrowLeft = left + width / 2 - 2.5; // width div transparent /2 - semi size % of arrow

  console.log('width', width);
  let image = null;
  if (me !== null && me.index + 1 < avatars.length) {
    image = avatars[me.index + 1];
  }

  return (
    <>
      {showOverlay && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-10 flex items-center justify-center z-[40]">
          <div
            className={`absolute z-50`}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${width}%`,
              height: `${height}%`,
              backgroundColor: 'transparent',
              boxShadow: '0 0 0 2000px rgba(0, 0, 0, 0.9)',
              borderRadius: `${radius}%`,
            }}
          />
          <div
            className={`absolute z-50 animate-arrow-bounce`}
            style={{
              position: 'absolute',
              top: `${top - 10}%`, // Positionnez légèrement au-dessus de la première div
              left: `${arrowLeft}% `, // Centrez en axe x
            }}
          >
            {/* Votre icône ou contenu de la deuxième div ici */}
            <ArrowBigDown fill="white" stroke="white" className="w-20 h-20" />
          </div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs z-50"
          >
            ✕
          </button>
          <div className="absolute flex justify-center items-center gap-6 top-6 z-50">
            <div className="w-32 h-32">
              <img src={image} alt="player" className="rounded-full object-cover w-full h-full mt-1" />
            </div>
            <Bubble texts={texts} variant="speechLeft" />
          </div>
          <button className="z-50 bg-white" onClick={handleNextStep}>
            Next Step
          </button>
        </div>
      )}
    </>
  );
};

export default OverlayTuto;
