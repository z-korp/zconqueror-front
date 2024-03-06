import { Battle } from '@/utils/types';
import Dice from '../Dice/Dice';

interface BattleRoundProps {
  battle: Battle;
  round: number;
}

const BattleRound: React.FC<BattleRoundProps> = ({ battle, round }) => {
  const attackerDices = battle.rounds[round].map((duel) => duel.attackerValue).filter((value) => value !== 0);
  const defenderDices = battle.rounds[round].map((duel) => duel.defenderValue).filter((value) => value !== 0);

  return (
    <div className="text-white">
      <div className="relative flex flex-col items-center">
        <div className="font-bold absolute left-0">[Round {round + 1}]</div>
        <div className="flex gap-4">
          <span>{battle.attackerName}</span>
          <span>{battle.defenderName}</span>
        </div>
        <div>
          {attackerDices.length} vs {defenderDices.length}
        </div>
      </div>
      <div className="flex flex-row gap-6">
        <div className="flex flex-col gap-2">
          {attackerDices.map((d, index) => (
            <Dice key={`attacker-${round}-${index}`} desiredResult={d} />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {defenderDices.map((d, index) => (
            <Dice key={`defender-${round}-${index}`} desiredResult={d} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleRound;
