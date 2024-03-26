import { LogType } from '@/hooks/useLogs';
import { DefendEvent, getNameFromId } from '@/utils/events';
import { Battle } from '@/utils/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface DefendLogProps {
  log: LogType;
  playerNames: string[];
  handleMouseOver: (regionId: number) => void;
  handleMouseLeave: () => void;
  handleMouseClickOnBattle: (battle: Battle) => void;
}

const DefendLog: React.FC<DefendLogProps> = ({
  log,
  playerNames,
  handleMouseOver,
  handleMouseLeave,
  handleMouseClickOnBattle,
}) => {
  const result = log.log as DefendEvent;

  return (
    <>
      <span>{`${playerNames[result.attackerIndex]} attacked ${playerNames[result.defenderIndex]} at region `}</span>
      <span
        className="underline cursor-pointer hover:text-yellow-500"
        onMouseOver={() => handleMouseOver(result.targetTile)}
        onMouseLeave={handleMouseLeave}
      >
        {`${getNameFromId(result.targetTile)}`}
      </span>
      <span>{` - `} </span>

      {log.battle ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className="underline cursor-pointer hover:text-yellow-500"
              onClick={() => log.battle && handleMouseClickOnBattle(log.battle)}
            >
              {`Result: ${result.result ? 'win' : 'lost'}`}
            </span>
          </TooltipTrigger>
          <TooltipContent>View Report</TooltipContent>
        </Tooltip>
      ) : (
        <span>{`: ${result.result ? 'win' : 'lost'}`}</span>
      )}
    </>
  );
};

export default DefendLog;
