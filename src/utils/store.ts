import { create } from 'zustand';

interface State {
  ip: number | undefined;
  set_ip: (ip: number) => void;
}

export const useElementStore = create<State>((set) => ({
  ip: undefined,
  hit_mob: undefined,
  set_ip: (ip: number) => set(() => ({ ip })),
}));
