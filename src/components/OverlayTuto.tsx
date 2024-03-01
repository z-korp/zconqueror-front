import React from 'react';
import { Button } from './ui/button';
import { ArrowBigDown } from 'lucide-react';

interface OverlayTutoProps {
  text: string;
  onClose: () => void;
  top: number;
  left: number;
}

const OverlayTuto: React.FC<OverlayTutoProps> = ({ text, onClose, top, left }) => {
  const arrowTop = top - 100;
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
      <div className={`absolute z-50 animate-arrow-bounce`} style={{ top: `${arrowTop}px`, left: `${left}px` }}>
        <ArrowBigDown fill="white" stroke="white" className="w-20 h-20" />
      </div>
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs z-50"
      >
        ✕
      </button>
      <span className="text-white text-6xl font-bold z-0">{text}</span>
    </div>
  );
};

export default OverlayTuto;
