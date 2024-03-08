import { CardType } from './cards';

export interface Player {
  game_id: number;
  index: number;
  address: string;
  name: string;
  supply: number;
  cards: CardType[];
  conqueror: boolean;
  rank: number;
}

export type Tile = {
  game_id: number;
  id: number;
  army: number;
  owner: number;
  dispatched: number;
  to: number;
  from: number;
  order: bigint;
};

export type Point = {
  x: number;
  y: number;
};

export type Continent = {
  id: number;
  name: string;
  regions: number[];
  supply: number;
};

export interface BattleEvent {
  attackerIndex: number;
  attackerValue: number;
  battleId: number;
  defenderIndex: number;
  defenderValue: number;
  attackerTroops: number;
  defenderTroops: number;
  duelId: number;
  gameId: number;
  nonce: number;
}

export interface Duel {
  battleId: number;
  duelId: number;
  attackerValue: number;
  defenderValue: number;
}

export interface Battle {
  gameId: number;
  nonce: number;
  attackerIndex: number;
  attackerName: string;
  defenderIndex: number;
  defenderName: string;
  attackerTroops: number;
  defenderTroops: number;
  rounds: Duel[][];
}
