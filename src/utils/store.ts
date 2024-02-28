import { create } from 'zustand';
import GameState from './gamestate';

export enum Phase {
  DEPLOY,
  ATTACK,
  FORTIFY,
}

interface State {
  game_id: number; // 0 = no game
  set_game_id: (game_id: number) => void;
  game_state: GameState;
  set_game_state: (game_state: GameState) => void;
  current_source: number | null;
  set_current_source: (source: number | null) => void;
  current_target: number | null;
  set_current_target: (target: number | null) => void;
  isContinentMode: boolean;
  setContinentMode: (mode: boolean) => void;
  army_count: number;
  set_army_count: (count: number) => void;
  highlighted_region: number | null;
  setHighlightedRegion: (region: number | null) => void;
  player_name: string;
  setPlayerName: (name: string) => void;
  lastDefendResult: any;
  setLastDefendResult: (result: any) => void;
  tilesConqueredThisTurn: number[];
  setTilesConqueredThisTurn: (tile: number[]) => void;
}

export const useElementStore = create<State>((set) => ({
  game_id: 0,
  set_game_id: (game_id: number) => set(() => ({ game_id })),
  game_state: GameState.MainMenu,
  set_game_state: (game_state: GameState) => set(() => ({ game_state })),
  current_source: null,
  set_current_source: (source: number | null) => set(() => ({ current_source: source })),
  current_target: null,
  set_current_target: (target: number | null) => set(() => ({ current_target: target })),
  isContinentMode: false,
  setContinentMode: (mode: boolean) => set(() => ({ isContinentMode: mode })),
  army_count: 0,
  set_army_count: (count: number) => set(() => ({ army_count: count })),
  highlighted_region: null,
  setHighlightedRegion: (region: number | null) => set(() => ({ highlighted_region: region })),
  player_name: '',
  setPlayerName: (name: string) => set(() => ({ player_name: name })),
  lastDefendResult: null,
  setLastDefendResult: (result: any) => set(() => ({ lastDefendResult: result })),
  tilesConqueredThisTurn: [],
  setTilesConqueredThisTurn: (tile: number[]) => set(() => ({ tilesConqueredThisTurn: tile })),
}));
