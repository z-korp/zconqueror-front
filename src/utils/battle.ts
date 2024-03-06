import { Battle, BattleEvent, Duel } from './types';

export function getBattleFromBattleEvents(
  duelEvents: BattleEvent[],
  attackerName: string,
  attackerTroups: number,
  defenderName: string,
  defenderTroups: number
): Battle {
  const attackerIndex = duelEvents[0].attackerIndex;
  const defenderIndex = duelEvents[0].defenderIndex;

  const duels: Duel[] = duelEvents.map((duel) => {
    return {
      battleId: duel.battleId,
      duelId: duel.duelId,
      attackerValue: duel.attackerValue,
      defenderValue: duel.defenderValue,
    };
  });

  return {
    gameId: duelEvents[0].gameId,
    nonce: duelEvents[0].nonce,
    attackerIndex,
    attackerName,
    defenderIndex,
    defenderName,
    attackerTroups,
    defenderTroups,
    rounds: groupDuelByIndex(duels),
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

  // Convert the Map into an array of duel arrays
  // Assuming battleIds start at 0 and are continuous
  const result: Duel[][] = Array.from(duelGroups.values());

  return result;
}

export function displayAttack(battle: Battle): void {
  let att = battle.attackerTroups;
  let def = battle.defenderTroups;
  const attackerName = battle.attackerName;
  const defenderName = battle.defenderName;
  const duelGroups = battle.rounds;

  console.log('duels', duelGroups);
  console.log(`-------------------------------------------------`);
  console.log(`[Battle] - ${attackerName} (${att}) vs (${def}) ${defenderName} `);
  console.log(`-------------------------------------------------`);
  duelGroups.forEach((duels, index) => {
    const attackerDices = duels.map((duel) => duel.attackerValue).filter((value) => value !== 0);
    const defenderDices = duels.map((duel) => duel.defenderValue).filter((value) => value !== 0);

    console.log(`[Round ${index}] - ${Math.min(att, 3)} vs ${Math.min(def, 2)}`);

    console.log(
      `    [Dices]  ${attackerName} [${attackerDices.join(', ')}] vs [${defenderDices.join(', ')}] ${defenderName}`
    );

    duels.forEach((duel, duelIndex) => {
      let attackerLost = 0;
      let defenderLost = 0;
      if (duel.attackerValue * duel.defenderValue !== 0) {
        if (duel.attackerValue > duel.defenderValue) defenderLost++;
        else attackerLost++;

        console.log(
          `    [Duel ${duelIndex}]  ${attackerName} [${duel.attackerValue}] (-${attackerLost}) vs (-${defenderLost}) [${duel.defenderValue}] - ${defenderName}`
        );
      }

      att -= attackerLost;
      def -= defenderLost;
    });
    if (att === 0) {
      console.log(`Defender ${defenderName} wins -> ${att} vs ${def}`);
    } else {
      console.log(`Attacker ${attackerName} wins -> ${att} vs ${def}`);
    }
    console.log(`-------------------------------------------------\n`);
  });
}