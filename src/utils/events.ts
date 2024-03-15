import { EventType, LogType } from '@/hooks/useLogs';
import { parse } from 'date-fns';
import nameData from '../assets/map/nameData.json';
import { Player } from './types';

export type Event = {
  id: string;
  keys: string[];
  data: string[];
  createdAt: string;
  transactionHash: string;
};

function getNameFromId(id: number): string {
  return (nameData as Record<string, string>)[id.toString()];
}

export function getIdFromName(name: string): number | null {
  const entries = Object.entries(nameData as Record<string, string>);
  for (const [id, storedName] of entries) {
    if (storedName === name) {
      return parseInt(id);
    }
  }
  return null; // return null if no matching name is found
}

//---------------------------------------------------------------------
// Supply event
interface SupplyEventResult {
  timestamp: string;
  playerIndex: number;
  troops: number;
  region: number;
}

export const parseSupplyEvent = (event: Event): SupplyEventResult => {
  //console.log('-------> Supply event', event);
  const troops = parseInt(event.data[0]);
  const region = parseInt(event.data[1]);
  const playerIndex = parseInt(event.keys[2]);

  return {
    timestamp: event.createdAt,
    playerIndex,
    troops,
    region,
  };
};

export const createSupplyLog = (result: SupplyEventResult, playerNames: string[]): LogType => {
  const date = parse(result.timestamp, 'yyyy-MM-dd HH:mm:ss', new Date());
  return {
    key: `${result.timestamp}-supply`,
    timestamp: date.getTime(),
    log: [
      `${playerNames[result.playerIndex]} supplied ${result.troops} troops to region`,
      getNameFromId(result.region),
    ],
    regionFrom: result.region,
    type: EventType.Supply,
  };
};

//---------------------------------------------------------------------
// Defend event
interface DefendEventResult {
  timestamp: string;
  attackerIndex: number;
  defenderIndex: number;
  targetTile: number;
  result: boolean;
}

export const parseDefendEvent = (event: Event): DefendEventResult => {
  //console.log('-------> Defend event', event);
  const targetTile = parseInt(event.data[0]);
  const result = Boolean(parseInt(event.data[1]));
  const attackerIndex = parseInt(event.keys[2]);
  const defenderIndex = parseInt(event.keys[3]);

  return {
    timestamp: event.createdAt,
    attackerIndex,
    defenderIndex,
    targetTile,
    result,
  };
};

export const createDefendLog = (result: DefendEventResult, playerNames: string[]): LogType => {
  const date = parse(result.timestamp, 'yyyy-MM-dd HH:mm:ss', new Date());
  return {
    key: `${result.timestamp}-defend`,
    timestamp: date.getTime(),
    log: [
      `${playerNames[result.attackerIndex]} attacked ${playerNames[result.defenderIndex]} at region`,
      getNameFromId(result.targetTile),
      `Result: ${result.result ? 'win' : 'lost'}`,
    ],
    regionTo: result.targetTile,
    type: EventType.Defend,
  };
};

//---------------------------------------------------------------------
// Fortify event
interface FortifyEventResult {
  timestamp: string;
  playerIndex: number;
  fromTile: number;
  toTile: number;
  troops: number;
}

export const parseFortifyEvent = (event: Event): FortifyEventResult => {
  //console.log('-------> Fortify event', event);
  const playerIndex = parseInt(event.keys[2]);
  const fromTile = parseInt(event.data[0]);
  const toTile = parseInt(event.data[1]);
  const troops = parseInt(event.data[2]);

  return {
    timestamp: event.createdAt,
    playerIndex,
    fromTile,
    toTile,
    troops,
  };
};

export const createFortifyLog = (result: FortifyEventResult, playerNames: string[]): LogType => {
  const date = parse(result.timestamp, 'yyyy-MM-dd HH:mm:ss', new Date());
  return {
    key: `${result.timestamp}-fortify`,
    timestamp: date.getTime(),
    log: [
      `${playerNames[result.playerIndex]} moved ${result.troops} from region `,
      getNameFromId(result.fromTile),
      `to region `,
      getNameFromId(result.toTile),
    ],
    regionFrom: result.fromTile,
    regionTo: result.toTile,
    type: EventType.Fortify,
  };
};

//---------------------------------------------------------------------
// Battle event
interface BattleEventResult {
  timestamp: string;
  gameId: number;
  txHash: string;
  battleId: number;
  duelId: number;
  attackerIndex: number;
  attackerTroops: number;
  attackerValue: number;
  defenderIndex: number;
  defenderTroops: number;
  defenderValue: number;
}

export const parseBattleEvent = (event: Event): BattleEventResult => {
  //console.log('-------> Battle event', event);
  const gameId = parseInt(event.keys[1]);
  const txHash = event.keys[2];
  // data
  const battleId = parseInt(event.data[0]);
  const duelId = parseInt(event.data[1]);
  const attackerIndex = parseInt(event.data[2]);
  const defenderIndex = parseInt(event.data[3]);
  const attackerTroops = parseInt(event.data[4]);
  const defenderTroops = parseInt(event.data[5]);
  const attackerValue = parseInt(event.data[6]);
  const defenderValue = parseInt(event.data[7]);

  return {
    timestamp: event.createdAt,
    gameId,
    txHash,
    battleId,
    duelId,
    attackerIndex,
    defenderIndex,
    attackerValue,
    defenderValue,
    attackerTroops,
    defenderTroops,
  };
};

export const createBattleLog = (result: BattleEventResult, playerNames: string[]): LogType => {
  const date = parse(result.timestamp, 'yyyy-MM-dd HH:mm:ss', new Date());
  return {
    key: `${result.timestamp}-battle`,
    timestamp: date.getTime(),
    log: [`${playerNames[result.attackerIndex]} battle battle`],
    type: EventType.Fortify,
  };
};
