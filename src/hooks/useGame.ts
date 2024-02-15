import { useDojo } from '@/dojo/useDojo';
import { sanitizeGame } from '@/utils/sanitizer';
import { useElementStore } from '@/utils/store';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { HasValue } from '@dojoengine/recs';

export const useGame = () => {
  const {
    setup: {
      clientComponents: { Game },
    },
  } = useDojo();

  const { game_id } = useElementStore((state) => state);

  const game = useComponentValue(Game, useEntityQuery([HasValue(Game, { id: game_id })]));

  return game === undefined ? undefined : sanitizeGame(game);
};
