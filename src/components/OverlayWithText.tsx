import React from 'react';

interface OverlayWithTextProps {
  text: string;
}

const OverlayWithText: React.FC<OverlayWithTextProps> = ({ text }) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-50"
      style={{
        background: 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)',
      }}
    >
      <span className="text-white text-6xl font-bold shadow-outline z-50">{text}</span>
    </div>
  );
};

export default OverlayWithText;
