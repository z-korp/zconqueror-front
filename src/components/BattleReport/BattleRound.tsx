import { Battle } from '@/utils/types';
import Dice from '../Dice/Dice';
import { Swords } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGetPlayers } from '@/hooks/useGetPlayers';

interface BattleRoundProps {
  battle: Battle;
  round: number;
}

const BattleRound: React.FC<BattleRoundProps> = ({ battle, round }) => {
  const { playerNames } = useGetPlayers();

  const attackerDices = battle.rounds[round].map((duel) => duel.attackerValue).filter((value) => value !== 0);
  const defenderDices = battle.rounds[round].map((duel) => duel.defenderValue).filter((value) => value !== 0);

  const dicesBattle = Math.min(attackerDices.length, defenderDices.length);

  const attackerWon = attackerDices.slice(0, dicesBattle).map((value, index) => {
    return value > defenderDices[index];
  });

  const [showPenalty, setShowPenalty] = useState(false);

  useEffect(() => {
    setShowPenalty(false);
    const timer = setTimeout(() => {
      setShowPenalty(true);
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount or before running the effect again
  }, [battle, round]);

  return (
    <div className="text-white w-96 flex flex-col items-center ">
      <div className="relative flex flex-col items-center w-full">
        <div className="font-bold absolute left-0">[Round {round + 1}]</div>
        <div className="flex w-full">
          <div className="flex-1 text-right mr-1">
            <span>{playerNames[battle.attackerIndex]}</span>
          </div>
          <div className="flex-1 text-left ml-1">
            <span>{playerNames[battle.defenderIndex]}</span>
          </div>
        </div>
        <div>
          {attackerDices.length} vs {defenderDices.length}
        </div>
      </div>
      <div className="flex flex-row h-[288px]">
        <div className="flex flex-col gap-2">
          {attackerDices.slice(0, dicesBattle).map((d, index) => (
            <div className="flex items-center justify-end" key={`attacker-${round}-${index}`}>
              {!attackerWon[index] && <span className="text-red-500 w-6">{`${showPenalty ? '-1' : ''}`}</span>}
              <Dice scale={0.3} desiredResult={d} />
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
          {attackerDices.slice(0, dicesBattle).map((_, index) => (
            <div className="h-[92px] flex items-center" key={`sword-${index}`}>
              <Swords className="w-8 h-8 text-white" />
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
