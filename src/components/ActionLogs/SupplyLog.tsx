import { LogType } from '@/hooks/useLogs';
import { SupplyEvent, getNameFromId } from '@/utils/events';

interface SupplyLogProps {
  log: LogType;
  playerNames: string[];
  handleMouseOver: (regionId: number) => void;
  handleMouseLeave: () => void;
}

const SupplyLog: React.FC<SupplyLogProps> = ({ log, playerNames, handleMouseOver, handleMouseLeave }) => {
  const result = log.log as SupplyEvent;

  return (
    <>
      <span>{`${playerNames[result.playerIndex]} supplied ${result.troops} troops to region `}</span>
      <span
        className="underline cursor-pointer hover:text-yellow-500"
        onMouseOver={() => handleMouseOver(result.region)}
        onMouseLeave={handleMouseLeave}
      >
        {`${getNameFromId(result.region)}`}
      </span>
    </>
  );
};

export default SupplyLog;
