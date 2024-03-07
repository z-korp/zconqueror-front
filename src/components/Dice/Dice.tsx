import React, { useState, useEffect } from 'react';
import { rotations } from '@/utils/rotations';
import './Dice.css';

interface DiceProps {
  desiredResult?: number;
  scale?: number;
}

const Dice: React.FC<DiceProps> = ({ desiredResult = 3, scale = 1 }) => {
  const [rotate, setRotate] = useState<string>('');

  useEffect(() => {
    const rotationTimeout = setTimeout(() => {
      setRotate(rotations[desiredResult]);
    }, 100);

    return () => {
      clearTimeout(rotationTimeout);
    };
  }, [desiredResult]);

  return (
    <div className="inline-flex origin-center m-20" style={{ transform: `scale(${scale})` }}>
      <div className="scene mt2 mb4">
        <div className="cube" style={{ transform: rotate }}>
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
    </div>
  );
};

export default Dice;
