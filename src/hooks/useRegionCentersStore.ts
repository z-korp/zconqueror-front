import { create } from 'zustand';

interface CenterPoint {
  x: number;
  y: number;
}

interface RegionCentersState {
  centers: Record<number, CenterPoint>;
  setCenter: (id: number, center: CenterPoint) => void;
}

export const useRegionCentersStore = create<RegionCentersState>((set) => ({
  centers: {},
  setCenter: (id, center) =>
    set((state) => ({
      centers: {
        ...state.centers,
        [id]: center,
      },
    })),
}));
