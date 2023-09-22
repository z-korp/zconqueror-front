import { FC } from "react";
import RoundButton from "../roundButton";

interface TroopsMarkerProps {
  position: { x: number; y: number };
  handlePathClick: () => void;
  troups: number;
}

const TroopsMarker: FC<TroopsMarkerProps> = ({
  position,
  handlePathClick,
  troups,
}) => {
  return (
    <RoundButton
      color="red"
      onClick={handlePathClick}
      className="absolute"
      style={{
        top: `calc(${position.y}px - 15px)`,
        left: `calc(${position.x}px - 15px)`,
      }}
    >
      <span className="text-lg text-black">{troups}</span>
    </RoundButton>
  );
};

export default TroopsMarker;
