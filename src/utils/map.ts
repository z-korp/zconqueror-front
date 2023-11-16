import mapDataNeighbour from '../assets/map/mapData/v01.json';

export const getNeighbors = (index: number): number[] => {
  return mapDataNeighbour.territories[index].neighbors.map((neighbor: number) => neighbor + 1);
};
