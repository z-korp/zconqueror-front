import React, { useState } from 'react';
import { Button } from '../ui/button';
import BattleRound from './BattleRound';
import { Battle } from '@/utils/types';
import BattleReport from './BattleReport';
import { SkipForward, StepForward } from 'lucide-react';

const OverlayBattle: React.FC<{ onClose: () => void; battle: Battle }> = ({ onClose, battle }) => {
  const [currentRound, setCurrentRound] = useState(0);

  const nextRound = () => {
    setCurrentRound(currentRound + 1);
  };

  const handleOverlayClick = () => {
    onClose();
  };

  const handleDialogClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50"
      style={{
        background: 'radial-gradient(circle, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%)',
      }}
      onClick={handleOverlayClick}
    >
      <Button
        onClick={onClose}
        className="absolute top-6 right-6 flex items-center justify-center p-1 w-[22px] h-[22px] bg-red-500 text-white rounded-full text-xs z-50"
      >
        ✕
      </Button>

      <div className="flex flex-col p-4 bg-stone-700 border-stone-900 rounded-lg shadow-lg" onClick={handleDialogClick}>
        {currentRound < battle.rounds.length ? (
          <BattleRound battle={battle} round={currentRound} />
        ) : (
          <BattleReport battle={battle} />
        )}

        {currentRound < battle.rounds.length && (
          <div className="flex mt-4 gap-4 self-end">
            <Button onClick={nextRound} className="w-fit flex gap-2">
              Next Round
              <StepForward size={15} />
            </Button>
            <Button className="w-fit flex gap-2" onClick={() => setCurrentRound(battle.rounds.length)}>
              Skip to Result
              <SkipForward size={15} />
            </Button>
          </div>
        )}
        {currentRound === battle.rounds.length && (
          <Button className="w-fit self-end" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </div>
  );
};

export default OverlayBattle;
