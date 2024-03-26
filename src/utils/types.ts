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

export interface Duel {
  battleId: number;
  duelId: number;
  attackerValue: number;
  defenderValue: number;
}

export interface Battle {
  gameId: number;
  attackerIndex: number;
  defenderIndex: number;
  attackerTroops: number;
  defenderTroops: number;
  rounds: Duel[][];
}
