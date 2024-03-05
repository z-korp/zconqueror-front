import React from 'react';
import { Button } from '../ui/button';
import BattleReport from './BattleReport';
import { Battle } from '@/utils/types';

const OverlayBattle: React.FC<{ onClose: () => void; battle: Battle }> = ({ onClose, battle }) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50"
      style={{
        background: 'radial-gradient(circle, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%)',
      }}
    >
      <Button
        onClick={onClose}
        className="absolute top-6 right-6 flex items-center justify-center p-1 w-[22px] h-[22px] bg-red-500 text-white rounded-full text-xs z-50"
      >
        ✕
      </Button>

      <div className="flex flex-col text-white">
        <BattleReport battle={battle} />
      </div>
    </div>
  );
};

export default OverlayBattle;
