import React from 'react';
import Dice from './Dice/Dice';

interface OverlayWithTextProps {
  text: string;
}

const round = 1;

const OverlayWithText: React.FC<OverlayWithTextProps> = ({ text }) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-[1000]"
      style={{
        background: 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)',
      }}
    >
      <span className="text-white text-6xl font-bold shadow-outline z-[1001]">{text}</span>
      <div className="flex relative justify-center items-center">
        <div className="absolute" style={{ transform: `translate(50px,-50px)` }}>
          <Dice currentRound={round} />
        </div>
        <div className="absolute" style={{ transform: `translate(-50px,50px)` }}>
          <Dice currentRound={round} />
        </div>
      </div>
    </div>
  );
};

export default OverlayWithText;
