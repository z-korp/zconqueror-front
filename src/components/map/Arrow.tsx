type ArrowProps = {
  position: { x: number; y: number };
  style?: CSSProperties;
};

import { CSSProperties } from 'react';

const Arrow = ({ position, style }: ArrowProps) => {
  const arrowStyle: CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: 'rotate(-180deg)',
    ...style,
  };

  return (
    <svg style={arrowStyle} width="50" height="50" viewBox="0 0 24 24">
      <path fill="red" d="M12,2 L18,12 L14,12 L14,22 L10,22 L10,12 L6,12 Z" />
    </svg>
  );
};

export default Arrow;
