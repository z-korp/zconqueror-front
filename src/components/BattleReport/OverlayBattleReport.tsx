import React from 'react';
import { Button } from '../ui/button';
import { Battle } from '@/utils/types';
import BattleReport from './BattleReport';
import { useElementStore } from '@/utils/store';

const OverlayBattleReport: React.FC<{ onClose: () => void; battle: Battle }> = ({ onClose }) => {
  const { battleReport } = useElementStore((state) => state);

  if (!battleReport) return null;

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

      <div
        className="p-4 bg-stone-700 border-stone-900 rounded-lg shadow-lg max-w-md mx-auto my-auto"
        onClick={handleDialogClick}
      >
        <BattleReport battle={battleReport} />
      </div>
    </div>
  );
};

export default OverlayBattleReport;
