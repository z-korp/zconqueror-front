import { Battle } from '@/utils/types';
import Dice from '../Dice/Dice';
import { Swords } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BattleRoundProps {
  battle: Battle;
  round: number;
}

const BattleRound: React.FC<BattleRoundProps> = ({ battle, round }) => {
  const attackerDices = battle.rounds[round].map((duel) => duel.attackerValue).filter((value) => value !== 0);
  const defenderDices = battle.rounds[round].map((duel) => duel.defenderValue).filter((value) => value !== 0);

  const dicesBattle = Math.min(attackerDices.length, defenderDices.length);

  const attackerWon = attackerDices.slice(0, dicesBattle).map((value, index) => {
    return value > defenderDices[index];
  });

  const [showPenalty, setShowPenalty] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPenalty(true), 3000);
    return () => clearTimeout(timer); // Cleanup the timer on component unmount or before running the effect again
  }, [battle, round]); // Depend on battle and round so it resets when these change

  return (
    <div className="text-white">
      <div className="relative flex flex-col items-center">
        <div className="font-bold absolute left-0">[Round {round + 1}]</div>
        <div className="flex w-full">
          <div className="flex-1 text-right mr-1">
            <span>{battle.attackerName}</span>
          </div>
          <div className="flex-1 text-left ml-1">
            <span>{battle.defenderName}</span>
          </div>
        </div>
        <div>
          {attackerDices.length} vs {defenderDices.length}
        </div>
      </div>
      <div className="flex flex-row ">
        <div className="flex flex-col gap-2">
          {attackerDices.slice(0, dicesBattle).map((d, index) => (
            <div className="flex items-center" key={`attacker-${round}-${index}`}>
              {!attackerWon[index] && <span className="text-red-500 w-6">{`${showPenalty ? '-1' : ''}`}</span>}
              <Dice scale={0.3} desiredResult={d} />
              <Swords className="w-8 h-8 text-white" />
            </div>
          ))}
          {attackerDices.slice(dicesBattle).map((d, index) => (
            <div className="flex items-center" key={`attacker-${round}-${index + dicesBattle}`}>
              <span className="w-6"></span>
              <Dice scale={0.3} desiredResult={d} />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {defenderDices.slice(0, dicesBattle).map((d, index) => (
            <div className="flex items-center" key={`defender-${round}-${index}`}>
              <Dice scale={0.3} desiredResult={d} />
              {attackerWon[index] && <span className="text-red-500 w-6">{`${showPenalty ? '-1' : ''}`}</span>}
            </div>
          ))}
          {defenderDices.slice(dicesBattle).map((d, index) => (
            <div className="flex items-center" key={`defender-${round}-${index + dicesBattle}`}>
              <Dice scale={0.3} desiredResult={d} />
              <span className="w-6"></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleRound;
