import { create } from 'zustand';

export enum Phase {
  DEPLOY,
  ATTACK,
  FORTIFY,
}

interface State {
  game: any;
  set_game: (game: any) => void;
  current_source: number | null;
  set_current_source: (source: number | null) => void;
  current_target: number | null;
  set_current_target: (target: number | null) => void;
  current_address: string | null;
  army_count: number;
  set_army_count: (count: number) => void;
  set_current_address: (address: string | null) => void;
  highlighted_region: number | null;
  setHighlightedRegion: (region: number | null) => void;
}

export const useElementStore = create<State>((set) => ({
  game: undefined,
  set_game: (game: any) => set(() => ({ game })),
  current_source: null,
  set_current_source: (source: number | null) => set(() => ({ current_source: source })),
  current_target: null,
  set_current_target: (target: number | null) => set(() => ({ current_target: target })),
  army_count: 0,
  set_army_count: (count: number) => set(() => ({ army_count: count })),
  current_address: null,
  set_current_address: (address: string | null) => set(() => ({ current_address: address })),
  highlighted_region: null,
  setHighlightedRegion: (region: number | null) => set(() => ({ highlighted_region: region })),
}));
