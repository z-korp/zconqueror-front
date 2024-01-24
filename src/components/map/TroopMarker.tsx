import { FC } from 'react';
import RoundButton from '../RoundButton';
import '../../styles/Button.css';

interface TroopsMarkerProps {
  position: { x: number; y: number };
  handlePathClick: () => void;
  troups: number;
  color: string;
  tile: any;
  playerTurn: number;
}

const TroopsMarker: FC<TroopsMarkerProps> = ({ position, handlePathClick, troups, color, tile, playerTurn }) => {
  if (troups === 0) return null;
  console.log('TroopsMarker', tile);
  return (
    <RoundButton
      color={color}
      onClick={handlePathClick}
      className="absolute"
      style={{
        top: `calc(${position.y}px - 15px)`,
        left: `calc(${position.x}px - 15px)`,
      }}
      shouldJump={tile.owner === playerTurn ? true : false}
    >
      <span className="text-lg text-white text-with-outline" data-text={troups}>
        {troups}
      </span>
    </RoundButton>
  );
};

export default TroopsMarker;
