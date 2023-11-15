type ArrowProps = {
  position: { x: number; y: number };
};

import { CSSProperties } from 'react';

const Arrow = ({ position }: ArrowProps) => {
  const style: CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    // transform: `rotate(${angle}deg)`,
  };

  return (
    <svg style={style} width="50" height="50" viewBox="0 0 24 24">
      <path fill="red" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
    </svg>
  );
};

export default Arrow;
