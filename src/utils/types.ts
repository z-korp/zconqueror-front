export interface Player {
  game_id: number;
  index: number;
  address: string;
  name: string;
  supply: number;
  cards: number[];
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
