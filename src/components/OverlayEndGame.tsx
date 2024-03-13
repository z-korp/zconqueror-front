import { Medal, Trophy } from 'lucide-react';
import React, { useState } from 'react';
import { avatars } from '../utils/pfps';
import { Button } from './ui/button';
import { useElementStore } from '@/utils/store';
import GameState from '@/utils/gamestate';
import { useMe } from '@/hooks/useMe';

interface OverlayEndGameProps {
  players: any;
  me: any;
}

const OverlayEndGame: React.FC<OverlayEndGameProps> = ({ me, players }) => {
  const text = 'Game Over';
  const [showOverlay, setShowOverlay] = useState(true);
  const { set_game_state, set_game_id } = useElementStore((state) => state);
  const { setMe } = useMe();
  const getColorRGB = (colorName: string) => {
    switch (colorName) {
      case 'bronze':
        return 'rgb(205, 127, 50)';
      default:
        return colorName;
    }
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const handleGoMenu = () => {
    set_game_id(undefined);
    set_game_state(GameState.MainMenu);
    // setMe(undefined);
    setShowOverlay(false);
  };

  return (
    <>
      {showOverlay && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex flex-col items-center justify-center z-[1000] vt323-font"
          style={{
            background: 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)',
          }}
        >
          <div className="relative flex flex-col items-center w-1/2 rounded-lg bg-stone-700 border-2 border-stone-900 pb-16 pt-16">
            <div className="absolute top-0 left-0 transform -translate-y-1/2 w-full flex justify-center">
              <span className="px-6 py-2 text-white text-6xl rounded-lg bg-stone-700 border-2 border-stone-900 drop-shadow-lg">
                {me.rank === 1 ? 'WINNER' : text}
              </span>
            </div>
            <Button className="absolute top-0 right-2 p-1 text-secondary text-lg" onClick={handleCloseOverlay}>
              ✕
            </Button>
            <div className="flex flex-col items-center justify-center w-full">
              {players
                .filter((player: any) => player.rank !== 0)
                .sort((playerA: any, playerB: any) => playerA.rank - playerB.rank)
                .map((player: any, index: number) => (
                  <div className="flex gap-4 mb-2 items-center justify-center text-white text-lg w-full" key={index}>
                    {player.rank === 1 && <Trophy className="w-8 h-8" stroke="gold" />}
                    {player.rank === 2 && <Medal className="w-8 h-8" stroke="silver" />}
                    {player.rank === 3 && <Medal className="w-8 h-8" stroke={getColorRGB('bronze')} />}
                    {player.rank !== 1 && player.rank !== 2 && player.rank !== 3 && (
                      <span className="w-8 h-8">{player.rank}</span>
                    )}
                    <img
                      src={avatars[player.index + 1]}
                      alt="player"
                      className="rounded-full object-cover w-14 h-14 mx-4 drop-shadow-lg"
                    />
                    <div className="w-1/2 bg-black p-1 rounded-lg drop-shadow-lg">
                      <h1>{player.name}</h1>
                    </div>
                  </div>
                ))}
            </div>
            <Button className="mt-4" onClick={handleGoMenu}>
              Back to lobby
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default OverlayEndGame;
