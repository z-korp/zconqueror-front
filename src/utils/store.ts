import { create } from 'zustand';

export enum Phase {
  NOTHING,
  DEPLOY,
  ATTACK,
  FORTIFY,
}

interface State {
  ip: number | undefined;
  set_ip: (ip: number) => void;
  current_state: Phase;
  set_current_state: (current_state: Phase) => void;
  current_source: number | null;
  set_current_source: (source: number | null) => void;
  current_target: number | null;
  set_current_target: (target: number | null) => void;
}

export const useElementStore = create<State>((set) => ({
  ip: undefined,
  set_ip: (ip: number) => set(() => ({ ip })),
  current_state: Phase.NOTHING,
  set_current_state: (current_state: Phase) => set(() => ({ current_state })),
  current_source: null,
  set_current_source: (source: number | null) => set(() => ({ current_source: source })),
  current_target: null,
  set_current_target: (target: number | null) => set(() => ({ current_target: target })),
}));
