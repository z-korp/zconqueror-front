import { EventType, LogType } from '@/hooks/useLogs';
import { parse } from 'date-fns';
import nameData from '../assets/map/nameData.json';

export type Event = {
  id: string;
  keys: string[];
  data: string[];
  createdAt: string;
  transactionHash: string;
};

export function getNameFromId(id: number): string {
  return (nameData as Record<string, string>)[id.toString()];
}

//---------------------------------------------------------------------
// Supply event
export interface SupplyEvent {
  timestamp: string;
  playerIndex: number;
  troops: number;
  region: number;
}

export const parseSupplyEvent = (event: Event): SupplyEvent => {
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

export const createSupplyLog = (result: SupplyEvent): LogType => {
  const date = parse(result.timestamp, 'yyyy-MM-dd HH:mm:ss', new Date());
  return {
    key: `${result.timestamp}-supply`,
    timestamp: date.getTime(),
    log: result,
    type: EventType.Supply,
  };
};

//---------------------------------------------------------------------
// Defend event
export interface DefendEvent {
  timestamp: string;
  attackerIndex: number;
  defenderIndex: number;
  targetTile: number;
  result: boolean;
}

export const parseDefendEvent = (event: Event): DefendEvent => {
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

export const createDefendLog = (result: DefendEvent): LogType => {
  const date = parse(result.timestamp, 'yyyy-MM-dd HH:mm:ss', new Date());
  return {
    key: `${result.timestamp}-defend`,
    timestamp: date.getTime(),
    log: result,
    type: EventType.Defend,
  };
};

//---------------------------------------------------------------------
// Fortify event
export interface FortifyEvent {
  timestamp: string;
  playerIndex: number;
  fromTile: number;
  toTile: number;
  troops: number;
}

export const parseFortifyEvent = (event: Event): FortifyEvent => {
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

export const createFortifyLog = (result: FortifyEvent): LogType => {
  const date = parse(result.timestamp, 'yyyy-MM-dd HH:mm:ss', new Date());
  return {
    key: `${result.timestamp}-fortify`,
    timestamp: date.getTime(),
    log: result,
    type: EventType.Fortify,
  };
};

//---------------------------------------------------------------------
// Battle event
export interface BattleEvent {
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

export const parseBattleEvent = (event: Event): BattleEvent => {
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
