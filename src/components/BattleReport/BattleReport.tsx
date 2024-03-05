import React from 'react';
import { Battle } from '@/utils/types';
import { Separator } from '../ui/separator';

interface BattleReportProps {
  battle: Battle;
}

const dices: { [key: number]: string } = {
  1: '⚀',
  2: '⚁',
  3: '⚂',
  4: '⚃',
  5: '⚄',
  6: '⚅',
};

const BattleReport: React.FC<BattleReportProps> = ({ battle }) => {
  let att = battle.attackerTroups;
  let def = battle.defenderTroups;

  let attackerLostTotal = 0;
  let defenderLostTotal = 0;

  return (
    <div className="w-96">
      <div className="relative">
        <div className="font-bold absolute left-0">[Battle]</div>
        <div>{`${battle.attackerName} - ${battle.defenderName}`}</div>
        <div>{`${att} vs ${def}`}</div>
      </div>
      <Separator className="my-2" />
      {battle.duels.map((duels, index) => {
        const attackerDices = duels.map((duel) => duel.attackerValue).filter((value) => value !== 0);
        const defenderDices = duels.map((duel) => duel.defenderValue).filter((value) => value !== 0);

        return (
          <div key={index}>
            <div className="relative">
              <div className="font-bold absolute left-0">[Round {index + 1}]</div>
              {Math.min(att, 3)} vs {Math.min(def, 2)}
            </div>
            {duels.map((duel, duelIndex) => {
              let attackerLost = 0;
              let defenderLost = 0;
              if (duel.attackerValue && duel.defenderValue) {
                if (duel.attackerValue > duel.defenderValue) defenderLost++;
                else attackerLost++;
              }
              att -= attackerLost;
              def -= defenderLost;
              attackerLostTotal += attackerLost;
              defenderLostTotal += defenderLost;

              return (
                <div key={duelIndex} className="flex flex-row justify-center">
                  <div className="w-1/2 text-right">
                    <span className="text-red-500">{` ${attackerLost ? `-${attackerLost}` : ''}`}</span>
                    <span className="ml-2">{`${dices[duel.attackerValue] ? dices[duel.attackerValue] : ''}`}</span>
                  </div>
                  <Separator orientation="vertical" className="h-6 mx-2 opacity-30" />
                  <div className="w-1/2 text-left">
                    <span className="mr-2">{`${dices[duel.defenderValue] ? dices[duel.defenderValue] : ''}`}</span>
                    <span className="text-red-500">{`${defenderLost ? `-${defenderLost}` : ''}`}</span>
                  </div>
                </div>
              );
            })}

            <Separator className="my-2" />
          </div>
        );
      })}
      <div className="relative">
        <div className="font-bold absolute left-0">[Result]</div>
        <div>{`${battle.attackerName} - ${battle.defenderName}`}</div>
      </div>
      <div className="flex flex-row justify-center relative">
        <div className="font-bold absolute left-0">INIT</div>
        <span>{`${battle.attackerTroups}`}</span>
        <Separator orientation="vertical" className="mx-2 h-6 opacity-30" />
        <span>{`${battle.defenderTroups}`}</span>
      </div>
      <div className="flex flex-row justify-center relative">
        <div className="font-bold absolute left-0">LOST</div>
        <span className="text-red-500">{`-${attackerLostTotal}`}</span>
        <Separator orientation="vertical" className="mx-2 h-6 opacity-30" />
        <span className="text-red-500">{`-${defenderLostTotal}`}</span>
      </div>
      <div className="flex flex-row justify-center relative">
        <div className="font-bold absolute left-0">REMAINING</div>
        <span className="text-green-500">{`${att}`}</span>
        <Separator orientation="vertical" className="mx-2 h-6 opacity-30" />
        <span className="text-green-500">{`${def}`}</span>
      </div>
    </div>
  );
};

export default BattleReport;
