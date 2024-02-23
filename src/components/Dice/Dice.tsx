import React, { useState, useEffect } from 'react';
import './Dice.css';

interface DiceProps {
  desiredResult: number;
}

const Dice: React.FC<DiceProps> = ({ desiredResult }) => {
  const [rotate, setRotate] = useState<string>('');
  const [fadeOut, setFadeOut] = useState<boolean>(false);

  useEffect(() => {
    // Calculer les rotations pour stabiliser sur la face désirée
    const rotations: { [key: number]: string } = {
      1: 'rotateX(720deg) rotateY(720deg)',
      2: 'rotateX(900deg) rotateY(720deg)',
      3: 'rotateX(720deg) rotateY(-810deg)',
      4: 'rotateX(720deg) rotateY(810deg)',
      5: 'rotateX(-810deg) rotateY(720deg)',
      6: 'rotateX(-270deg) rotateY(-270deg)',
      7: 'rotateX(1440deg) rotateY(1440deg)', // Is a default case
    };

    // Appliquer la rotation correspondant à la valeur désirée
    const rotationTimeout = setTimeout(() => {
      setRotate(rotations[desiredResult]);
    }, 100);

    // const fadeoutTimeout = setTimeout(() => {
    //   setFadeOut(true);
    // }, 3000);

    return () => {
      clearTimeout(rotationTimeout);
      //clearTimeout(fadeoutTimeout);
    };
  }, [desiredResult]);

  return (
    <div className="scene dim mt2 mb4 ">
      <div
        className={`cube ${fadeOut ? 'transform opacity-0 ease-in-out duration-500' : ''}`}
        style={{ transform: rotate }}
      >
        <div className="bg-white cube__face cube__face--front front">
          <span className="dot dot1" />
        </div>
        <div className="bg-white cube__face cube__face--back back">
          <span className="dot dot1" />
          <span className="dot dot2" />
        </div>
        <div className="bg-white cube__face cube__face--right right">
          <span className="dot dot1" />
          <span className="dot dot2" />
          <span className="dot dot3" />
        </div>
        <div className="bg-white cube__face cube__face--left left">
          <span className="dot dot1" />
          <span className="dot dot2" />
          <span className="dot dot3" />
          <span className="dot dot4" />
        </div>
        <div className="bg-white cube__face cube__face--top top">
          <span className="dot dot1" />
          <span className="dot dot2" />
          <span className="dot dot3" />
          <span className="dot dot4" />
          <span className="dot dot5" />
        </div>
        <div className="bg-white cube__face cube__face--bottom bottom">
          <span className="dot dot1" />
          <span className="dot dot2" />
          <span className="dot dot3" />
          <span className="dot dot4" />
          <span className="dot dot5" />
          <span className="dot dot6" />
        </div>
      </div>
    </div>
  );
};

export default Dice;
