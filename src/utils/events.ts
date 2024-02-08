import { EventType, LogType } from '@/hooks/useLogs';
import { feltToStr } from './unpack';
import nameData from '../assets/map/nameData.json';

export type Event = {
  keys: string[];
  data: string[];
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
  playerName: string;
  troops: number;
  region: number;
}

export const parseSupplyEvent = (event: Event): SupplyEventResult => {
  console.log('-------> Supply event', event);
  const troops = parseInt(event.data[0]);
  const region = parseInt(event.data[1]);
  const playerName = feltToStr(event.keys[1]);

  return {
    playerName,
    troops,
    region,
  };
};

export const createSupplyLog = (result: SupplyEventResult): LogType => {
  return {
    timestamp: Date.now(),
    log: [`${result.playerName} supplied ${result.troops} troops to region`, getNameFromId(result.region)],
    regionFrom: result.region,
    type: EventType.Supply,
  };
};

//---------------------------------------------------------------------
// Defend event
interface DefendEventResult {
  attackerName: string;
  defenderName: string;
  targetTile: number;
  result: boolean;
}

export const parseDefendEvent = (event: Event): DefendEventResult => {
  console.log('-------> Defend event', event);
  const targetTile = parseInt(event.data[0]);
  const result = Boolean(parseInt(event.data[1]));
  const attackerName = feltToStr(event.keys[1]);
  const defenderName = feltToStr(event.keys[2]);

  return {
    attackerName,
    defenderName,
    targetTile,
    result,
  };
};

export const createDefendLog = (result: DefendEventResult): LogType => {
  return {
    timestamp: Date.now(),
    log: [
      `${result.attackerName} attacked ${result.defenderName} at region`,
      getNameFromId(result.targetTile),
      `Result: ${result.result ? 'win' : 'loose'}`,
    ],
    regionTo: result.targetTile,
    type: EventType.Defend,
  };
};

//---------------------------------------------------------------------
// Fortify event
interface FortifyEventResult {
  playerName: string;
  fromTile: number;
  toTile: number;
  troops: number;
}

export const parseFortifyEvent = (event: Event): FortifyEventResult => {
  console.log('-------> Fortify event', event);
  const playerName = feltToStr(event.keys[1]);
  const fromTile = parseInt(event.data[0]);
  const toTile = parseInt(event.data[1]);
  const troops = parseInt(event.data[2]);

  return {
    playerName,
    fromTile,
    toTile,
    troops,
  };
};

export const createFortifyLog = (result: FortifyEventResult): LogType => {
  return {
    timestamp: Date.now(),
    log: [
      `${result.playerName} moved ${result.troops} from region `,
      getNameFromId(result.fromTile),
      `to region `,
      getNameFromId(result.toTile),
    ],
    regionFrom: result.fromTile,
    regionTo: result.toTile,
    type: EventType.Fortify,
  };
};
