import React, { useState, useEffect } from 'react';
import './dice.css';
const Dice = ({ currentRound }) => {
  const [rotate, setRotate] = useState('');
  useEffect(() => {
    if (currentRound === 6) {
      setRotate(1);
    }
  });
  const roll = () => {
    if (currentRound === 6) {
      //init();
      return;
    }

    const caculateResult = (xDeg, yDeg) => {
      const vDict = { 0: 1, 1: 4, 2: 2, 3: 3 };
      const hDict = {
        1: [1, 6, 2, 5],
        4: [4, 6, 3, 5],
        2: [2, 6, 1, 5],
        3: [3, 6, 4, 5],
      };
      let xTruns = (xDeg % 360) / 90;
      let yTruns = (yDeg % 360) / 90;
      let result = hDict[vDict[yTruns]][xTruns];
      return result;
    };
    const min = 40;
    const max = 100;
    const xRand = Math.floor(Math.random() * max + min) * 90;
    const yRand = Math.floor(Math.random() * max + min) * 90;
    const rotate = 'rotateX(' + xRand + 'deg) rotateY(' + yRand + 'deg)';
    const value = caculateResult(xRand, yRand);
    setRotate(rotate);
    //caculateResult(xRand, yRand);
    // update scores and round with delay
  };
  return (
    <div className="scene dim mt2 mb4 " onClick={roll}>
      <div className="cube" style={{ transform: rotate }}>
        <div className="bg-white cube__face cube__face--front front">
          <span className="dot dot1" />
        </div>
        <div className="bg-white cube__face cube__face--back back">
          <span className="dot dot1" />
          <span className="dot dot2" />
        </div>
        <div className=" bg-white cube__face cube__face--right right">
          <span className="dot dot1" />
          <span className="dot dot2" />
          <span className="dot dot3" />
        </div>
        <div className=" bg-white cube__face cube__face--left left">
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
        <div className=" bg-white cube__face cube__face--bottom bottom">
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
