import { useDojo } from '@/DojoContext';
import { sanitizePlayer } from '@/utils/sanitizer';
import { useElementStore } from '@/utils/store';
import { useEntityQuery } from '@dojoengine/react';
import { Has, HasValue, getComponentValue } from '@dojoengine/recs';
import { useEffect, useMemo } from 'react';

export function useGetPlayers() {
  const {
    setup: {
      clientComponents: { Player },
    },
  } = useDojo();

  const { game } = useElementStore((state) => state);

  const playerEntities = useEntityQuery([Has(Player), HasValue(Player, { game_id: game?.id })]);
  const players = useMemo(
    () =>
      playerEntities
        .map((id) => getComponentValue(Player, id))
        .sort((a, b) => a.index - b.index)
        .map(sanitizePlayer),
    [playerEntities, Player]
  );

  useEffect(() => {
    // console.log('players', players);
  }, [players]);

  return {
    players,
  };
}
