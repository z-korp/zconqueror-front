import { FC } from "react";

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
    <div
      className="absolute flex justify-center items-center cursor-pointer bg-red-500 border-2 border-red-700 rounded-full w-8 h-8"
      style={{
        top: `calc(${position.y}px - 15px)`,
        left: `calc(${position.x}px - 15px)`,
      }}
      onClick={handlePathClick}
    >
      <span className="text-lg text-black">{troups}</span>
    </div>
  );
};

export default TroopsMarker;
