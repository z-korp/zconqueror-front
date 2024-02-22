import React, { useState, useEffect } from 'react';
import './dice.css';

interface DiceProps {
  currentRound: number;
}

const Dice: React.FC<DiceProps> = ({ currentRound }) => {
  const [rotate, setRotate] = useState<string>('');
  const [fadeOut, setFadeOut] = useState<boolean>(false);

  useEffect(() => {
    if (currentRound === 6) {
      setRotate('rotate(90deg)');
    }

    roll();
    setTimeout(() => {
      setFadeOut(true);
    }, 3000);
  }, [currentRound]);

  const roll = () => {
    if (currentRound === 6) {
      //init();
      return;
    }

    const calculateResult = (xDeg: number, yDeg: number): number => {
      const vDict: { [key: number]: number } = { 0: 1, 1: 4, 2: 2, 3: 3 };
      const hDict: { [key: number]: number[] } = {
        1: [1, 6, 2, 5],
        4: [4, 6, 3, 5],
        2: [2, 6, 1, 5],
        3: [3, 6, 4, 5],
      };
      let xTruns: number = (xDeg % 360) / 90;
      let yTruns: number = (yDeg % 360) / 90;
      let result: number = hDict[vDict[yTruns]][xTruns];
      return result;
    };

    const min: number = 40;
    const max: number = 100;
    const xRand: number = Math.floor(Math.random() * max + min) * 90;
    const yRand: number = Math.floor(Math.random() * max + min) * 90;
    const rotate: string = `rotateX(${xRand}deg) rotateY(${yRand}deg)`;
    const value: number = calculateResult(xRand, yRand);
    setRotate(rotate);
    // update scores and round with delay
  };

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
