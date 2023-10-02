import { useElementStore } from '@/utils/store';
import { useComponentValue } from '@dojoengine/react';
import { EntityIndex } from '@latticexyz/recs';
import { useEffect } from 'react';
import { useDojo } from '../DojoContext';

export const useComponentStates = () => {
  const {
    setup: {
      components: { Game },
    },
  } = useDojo();

  const { ip } = useElementStore((state) => state);

  const entityId = ip as EntityIndex;
  const game = useComponentValue(Game, entityId);

  useEffect(() => {
    console.log('game', game);
  }, [game]);

  return {
    game: { id: game?.id, over: game?.over, seed: game?.seed },
  };
};
