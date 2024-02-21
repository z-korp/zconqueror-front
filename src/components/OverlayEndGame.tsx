import React from 'react';

interface OverlayEndGameProps {
  players: any;
}

const OverlayEndGame: React.FC<OverlayEndGameProps> = ({ players }) => {
  const text = 'Game Over';
  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex flex-col items-center justify-center z-[1000]"
      style={{
        background: 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)',
      }}
    >
      <span className="text-white text-6xl font-bold shadow-outline z-[1001]">{text}</span>
      <div className="text-white">
        {players.map((player) => (
          <h1>{player.name}</h1>
        ))}
      </div>
    </div>
  );
};

export default OverlayEndGame;
