import React from 'react';
import { ArrowBigDown } from 'lucide-react';
import { useMe } from '@/hooks/useMe';
import { avatars } from '@/utils/pfps';
import Bubble from './Bubble';

interface OverlayTutoProps {
  text: string;
  onClose: () => void;
  top: number;
  left: number;
}

const OverlayTuto: React.FC<OverlayTutoProps> = ({ text, onClose, top, left }) => {
  const { me } = useMe();

  console.log('me', me);
  const arrowTop = top - 80;
  const arrowLeft = left + 20 / 2; // Arrow width / 2

  let image = null;
  if (me !== null && me.index + 1 < avatars.length) {
    image = avatars[me.index + 1];
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-10 flex items-center justify-center z-[40]">
      <div
        className={`absolute z-50`}
        style={{
          top: `${top}px`,
          left: `${left}px`,
          width: '100px',
          height: '100px',
          backgroundColor: 'transparent',
          boxShadow: '0 0 0 2000px rgba(0, 0, 0, 0.9)',
          borderRadius: '50%',
        }}
      />
      <div className={`absolute z-50 animate-arrow-bounce`} style={{ top: `${arrowTop}px`, left: `${arrowLeft}px` }}>
        <ArrowBigDown fill="white" stroke="white" className="w-20 h-20" />
      </div>
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs z-50"
      >
        ✕
      </button>
      <div className="absolute flex justify-center items-center gap-6 top-6 z-50">
        <div className="w-32 h-32">
          <img src={image} alt="player" className="rounded-full object-cover w-full h-full mt-1" />
        </div>
        <Bubble texts={['To start a new Battle you need first to deploy your troups']} variant="speechLeft" />
      </div>
    </div>
  );
};

export default OverlayTuto;
