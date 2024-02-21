import { useDojo } from '@/dojo/useDojo';
import { sanitizeGame } from '@/utils/sanitizer';
import { useElementStore } from '@/utils/store';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { HasValue } from '@dojoengine/recs';
import { useMemo } from 'react';

export const useGame = () => {
  const {
    setup: {
      clientComponents: { Game },
    },
  } = useDojo();

  const { game_id } = useElementStore((state) => state);

  const gameComponentValue = useComponentValue(Game, useEntityQuery([HasValue(Game, { id: game_id })]));

  const sanitizedGame = useMemo(
    () => (gameComponentValue === undefined ? undefined : sanitizeGame(gameComponentValue)),
    [gameComponentValue]
  );

  return sanitizedGame;
};
