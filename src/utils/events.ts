import { LogType } from '@/hooks/useLogs';
import { feltToStr } from './unpack';

export type Event = {
  keys: string[];
  data: string[];
};

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
    log: `${result.playerName} supplied ${result.troops} to region ${result.region}`,
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
    log: `${result.attackerName} attacked ${result.defenderName} at region ${result.targetTile}. Result: ${
      result.result ? 'win' : 'loose'
    }`,
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
    log: `${result.playerName} moved ${result.troops} from region ${result.fromTile} to region ${result.toTile}`,
  };
};
