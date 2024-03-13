import { useDojo } from '@/dojo/useDojo';
import { sanitizePlayer } from '@/utils/sanitizer';
import { useElementStore } from '@/utils/store';
import { Player } from '@/utils/types';
import { useEntityQuery } from '@dojoengine/react';
import { Has, HasValue, getComponentValue } from '@dojoengine/recs';
import { useMemo } from 'react';

export function useGetPlayers(): { players: Player[]; playerNames: string[] } {
  const {
    setup: {
      clientComponents: { Player },
    },
  } = useDojo();

  const { game_id } = useElementStore((state) => state);

  const playerEntities = useEntityQuery([Has(Player), HasValue(Player, { game_id: game_id })]);
  const players = useMemo(
    () =>
      playerEntities
        .map((id) => getComponentValue(Player, id))
        .sort((a, b) => a.index - b.index)
        .map(sanitizePlayer),
    [playerEntities, Player]
  );

  const playerNames = useMemo(() => {
    return players.map((player) => player.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players.map((player) => player.name).toString()]);

  return {
    players,
    playerNames,
  };
}
