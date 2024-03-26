import { BattleEvent } from './events';
import { Battle, Duel } from './types';

export function getBattleFromBattleEvents(battleEvents: BattleEvent[]): Battle {
  const attackerIndex = battleEvents[0].attackerIndex;
  const defenderIndex = battleEvents[0].defenderIndex;

  const duels: Duel[] = battleEvents.map((duel) => {
    return {
      battleId: duel.battleId,
      duelId: duel.duelId,
      attackerValue: duel.attackerValue,
      defenderValue: duel.defenderValue,
    };
  });

  return {
    gameId: battleEvents[0].gameId,
    attackerIndex,
    defenderIndex,
    attackerTroops: battleEvents[0].attackerTroops,
    defenderTroops: battleEvents[0].defenderTroops,
    rounds: groupDuelByIndex(duels).sort((a, b) => a[0].battleId - b[0].battleId),
  };
}

export function groupDuelByIndex(duels: Duel[]): Duel[][] {
  const duelGroups = new Map<number, Duel[]>();

  duels.forEach((duel) => {
    if (!duelGroups.has(duel.battleId)) {
      duelGroups.set(duel.battleId, []);
    }
    duelGroups.get(duel.battleId)?.push(duel);
  });

  // Sort each group of duels by duelId in increasing order
  duelGroups.forEach((group) => {
    group.sort((a, b) => a.duelId - b.duelId);
  });

  // Convert the Map into an array of duel arrays
  // Assuming battleIds start at 0 and are continuous
  const result: Duel[][] = Array.from(duelGroups.values());

  return result;
}
