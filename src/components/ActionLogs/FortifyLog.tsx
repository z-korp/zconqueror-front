import { LogType } from '@/hooks/useLogs';
import { FortifyEvent, getNameFromId } from '@/utils/events';

interface FortifyLogProps {
  log: LogType;
  playerNames: string[];
  handleMouseOver: (regionId: number) => void;
  handleMouseLeave: () => void;
}

const FortifyLog: React.FC<FortifyLogProps> = ({ log, playerNames, handleMouseOver, handleMouseLeave }) => {
  const result = log.log as FortifyEvent;

  return (
    <>
      <span>{`${playerNames[result.playerIndex]} moved ${result.troops} from region `} </span>
      <span
        className="underline cursor-pointer hover:text-yellow-500"
        onMouseOver={() => handleMouseOver(result.fromTile)}
        onMouseLeave={handleMouseLeave}
      >
        {getNameFromId(result.fromTile)}
      </span>
      <span> {`to region `} </span>
      <span
        className="cursor-pointer hover:text-yellow-500 underline"
        onMouseOver={() => handleMouseOver(result.toTile)}
        onMouseLeave={handleMouseLeave}
      >
        {getNameFromId(result.toTile)}
      </span>
    </>
  );
};

export default FortifyLog;
