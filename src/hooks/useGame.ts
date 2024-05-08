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

  const current_turn = Math.floor(sanitizedGame.nonce / (3 * sanitizedGame.player_count) + 1);
  const number_max_turns = Math.floor(sanitizedGame.limit / (3 * sanitizedGame.player_count));

  return {
    ...sanitizedGame,
    current_turn: Math.min(current_turn, number_max_turns),
    number_max_turns: number_max_turns,
  };
};
