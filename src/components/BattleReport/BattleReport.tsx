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
  let att = battle.attackerTroops;
  let def = battle.defenderTroops;

  let attackerLostTotal = 0;
  let defenderLostTotal = 0;

  return (
    <div className="w-96 vt323-font text-white">
      <div className="relative">
        <div className="font-bold absolute left-0">[Battle]</div>
        <div className="flex w-full">
          <div className="flex-1 text-right mr-1">
            <span>{battle.attackerName}</span>
          </div>
          <div className="flex-1 text-left ml-1">
            <span>{battle.defenderName}</span>
          </div>
        </div>
        <div>{`${att} vs ${def}`}</div>
      </div>
      <Separator className="my-2" />
      {battle.rounds.map((round, index) => (
        <div key={index}>
          <div className="relative">
            <div className="font-bold absolute left-0">[Round {index + 1}]</div>
            {Math.min(att, 3)} vs {Math.min(def, 2)}
          </div>
          {round.map((duel, duelIndex) => {
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
      ))}
      <div className="relative">
        <div className="font-bold absolute left-0">[Result]</div>
        <div className="flex w-full">
          <div className="flex-1 text-right mr-1">
            <span>{battle.attackerName}</span>
          </div>
          <div className="flex-1 text-left ml-1">
            <span>{battle.defenderName}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-center relative">
        <div className="font-bold absolute left-0">INIT</div>
        <span className="w-3 text-right">{`${battle.attackerTroops}`}</span>
        <Separator orientation="vertical" className="mx-2 h-6 opacity-30" />
        <span className="w-3 text-left">{`${battle.defenderTroops}`}</span>
      </div>

      <div className="flex flex-row justify-center relative">
        <div className="font-bold absolute left-0">LOST</div>
        {attackerLostTotal === 0 ? (
          <span className="w-3 text-right">0</span>
        ) : (
          <span className="text-red-500 w-3 text-right">{`-${attackerLostTotal} `}</span>
        )}
        <Separator orientation="vertical" className="mx-2 h-6 opacity-30" />
        {defenderLostTotal === 0 ? (
          <span className="w-3 text-left">0</span>
        ) : (
          <span className="text-red-500 w-3 text-left">{`-${defenderLostTotal}`}</span>
        )}
      </div>
      <div className="flex flex-row justify-center relative">
        <div className="font-bold absolute left-0">REMAINING</div>
        <span className="text-green-500 w-3 text-right">{`${att}`}</span>
        <Separator orientation="vertical" className="mx-2 h-6 opacity-30" />
        <span className="text-green-500 w-3 text-left">{`${def}`}</span>
      </div>
    </div>
  );
};

export default BattleReport;
