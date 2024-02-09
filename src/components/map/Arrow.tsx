import { Phase } from '@/utils/store';
import { CSSProperties } from 'react';

import { GiBroadsword, GiFlyingFlag } from 'react-icons/gi';

type ArrowProps = {
  from: { x: number; y: number };
  to: { x: number; y: number };
  style?: CSSProperties;
  action: Phase.ATTACK | Phase.FORTIFY;
  color?: string; // Optional color prop to customize line color
  dotSize?: number; // Optional prop to customize the size of the dots
};

const Arrow = ({ from, to, style, color = 'blue', dotSize = 5, action }: ArrowProps) => {
  // Calculate the direction vector (dx, dy) and its magnitude (length)
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  // Normalize the direction vector (to have a magnitude of 1)
  const dxNormalized = dx / length;
  const dyNormalized = dy / length;

  // Offset the start and end points by a defined amount along the direction vector
  const offset = 15; // Change this value if you want a different offset
  const adjustedLength = length - 2 * offset;
  const adjustedFrom = {
    x: from.x + dxNormalized * offset,
    y: from.y + dyNormalized * offset,
  };

  // Calculate angle for the rotation
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  const arrowStyle: CSSProperties = {
    position: 'absolute',
    left: `${adjustedFrom.x}px`,
    top: `${adjustedFrom.y}px`,
    transform: `rotate(${angle}deg)`,
    transformOrigin: '0 0',
    ...style,
  };

  console.log('angle', (angle + 45).toFixed(0));

  return (
    <div style={arrowStyle}>
      <div
        className={`absolute bg-slate-700 border-slate-400 border rounded-full p-1 drop-shadow-sm`}
        style={{ left: '50%', transform: `translateX(-50%) translateY(-50%) rotate(${(360 - angle).toFixed(0)}deg)` }}
      >
        {action === Phase.ATTACK ? (
          <GiBroadsword className={`text-slate-50 w-3 h-3 `} />
        ) : (
          <GiFlyingFlag className={`text-slate-50 w-3 h-3 `} />
        )}
      </div>

      <svg viewBox={`0 0 ${adjustedLength} 10`} width={`${adjustedLength}px`} height="10px">
        {/* Dotted Line */}
        <line
          x1="0"
          y1="0"
          x2={adjustedLength}
          y2="0"
          stroke={'rgb(51 65 85)'}
          strokeWidth="10"
          strokeDasharray={`${dotSize},${dotSize * 0.8}`}
        />
      </svg>
    </div>
  );
};

export default Arrow;
