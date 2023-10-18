import { create } from 'zustand';

interface State {
  ip: number | undefined;
  set_ip: (ip: number) => void;
  current_state: number;
  set_current_state: (current_state: number) => void;
}

export const useElementStore = create<State>((set) => ({
  ip: undefined,
  hit_mob: undefined,
  set_ip: (ip: number) => set(() => ({ ip })),
  current_state: 1,
  set_current_state: (current_state: number) => set(() => ({ current_state })),
}));
