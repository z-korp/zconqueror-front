import mapDataNeighbour from '../assets/map/mapData/v01.json';

// the id is the id of the tile (starting from 1)
export const getNeighbors = (id: number): number[] => {
  return mapDataNeighbour.territories[id - 1].neighbors;
};
