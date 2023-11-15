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
  current_fortifier: number | undefined;
  set_current_fortifier: (current_fortifier: number | undefined) => void;
  current_fortified: number | undefined;
  set_current_fortified: (current_fortified: number | undefined) => void;
  current_attacker: any;
  set_current_attacker: (currentAttacker: number) => void;
  set_current_defender: (defender: number) => void;
  current_defender: any;
}

export const useElementStore = create<State>((set) => ({
  ip: undefined,
  set_ip: (ip: number) => set(() => ({ ip })),
  current_state: Phase.DEPLOY,
  set_current_state: (current_state: Phase) => set(() => ({ current_state })),
  current_fortifier: undefined,
  set_current_fortifier: (current_fortifier: number | undefined) => set(() => ({ current_fortifier })),
  current_fortified: undefined,
  set_current_fortified: (current_fortified: number | undefined) => set(() => ({ current_fortified })),
  current_attacker: null,
  set_current_attacker: (current_attacker: number) => set(() => ({ current_attacker })),
  current_defender: null,
  set_current_defender: (defender: number) => set(() => ({ current_defender: defender })),
}));
