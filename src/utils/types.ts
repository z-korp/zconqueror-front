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
