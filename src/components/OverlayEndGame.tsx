import { Medal, Trophy } from 'lucide-react';
import React, { useState } from 'react';
import { avatars } from '../utils/pfps';

interface OverlayEndGameProps {
  players: any;
}

const OverlayEndGame: React.FC<OverlayEndGameProps> = ({ players }) => {
  const text = 'Game Over';
  const [showOverlay, setShowOverlay] = useState(true);

  const getColorRGB = (colorName) => {
    switch (colorName) {
      case 'bronze':
        return 'rgb(205, 127, 50)';
      default:
        return colorName;
    }
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    console.log('Overlay fermé');
  };
  return (
    <>
      {showOverlay && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex flex-col items-center justify-center z-[1000]"
          style={{
            background: 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)',
          }}
        >
          <button className="top-0 right-0 text-secondary" onClick={handleCloseOverlay}>
            X
          </button>
          <span className="text-white text-6xl font-bold shadow-outline z-[1001]">{text}</span>
          <div className="text-white text-lg">
            {players
              .filter((player) => player.rank !== 0)
              .sort((a, b) => a.rank - b.rank)
              .map((player, index) => (
                <div className="flex gap-3 items-center" key={index}>
                  {player.rank === 1 && <Trophy className="w-10 h-10" stroke="gold" />}
                  {player.rank === 2 && <Medal className="w-10 h-10" stroke="silver" />}
                  {player.rank === 3 && <Medal className="w-10 h-10" stroke={getColorRGB('bronze')} />}
                  {player.rank !== 1 && player.rank !== 2 && player.rank !== 3 && <span>{player.rank}</span>}
                  <img src={avatars[player.index + 1]} alt="player" className="rounded-full object-cover w-14 h-14" />
                  <h1>{player.name}</h1>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default OverlayEndGame;
