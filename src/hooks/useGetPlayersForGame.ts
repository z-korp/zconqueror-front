import { useDojo } from '@/dojo/useDojo';
import { sanitizePlayer } from '@/utils/sanitizer';
import { useEntityQuery } from '@dojoengine/react';
import { Has, HasValue, getComponentValue } from '@dojoengine/recs';
import { useMemo } from 'react';

export function useGetPlayersForGame(gameId: number | undefined) {
  const {
    setup: {
      clientComponents: { Player },
    },
  } = useDojo();

  const playerEntities = useEntityQuery([Has(Player), HasValue(Player, { game_id: gameId })]);
  const players = useMemo(
    () =>
      playerEntities
        .map((id) => getComponentValue(Player, id))
        .filter((player) => player.address)
        .sort((a, b) => a.index - b.index)
        .map(sanitizePlayer),
    [playerEntities, Player]
  );

  return {
    players,
  };
}
