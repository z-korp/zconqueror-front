import mapDataNeighbour from '../assets/map/mapData/v01.json';

// the id is the id of the tile (starting from 1)
export const getNeighbors = (id: number): number[] => {
  return mapDataNeighbour.territories[id - 1].neighbors;
};

export const getAllConnectedTiles = (sourceId: any, tiles: any, ownerId: any): any[] => {
  const visited = new Set();
  let queue = [sourceId];

  while (queue.length > 0) {
    const current = queue.shift();

    if (!visited.has(current)) {
      visited.add(current);
      const neighbors = getNeighbors(current).filter((id) => tiles[id - 1].owner === ownerId);
      queue = queue.concat(neighbors);
    }
  }

  return Array.from(visited);
};
