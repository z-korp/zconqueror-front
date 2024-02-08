import { useDojo } from '@/DojoContext';
import { useElementStore } from '@/utils/store';
import { feltToStr, unpackU128toNumberArray } from '@/utils/unpack';
import { useEntityQuery } from '@dojoengine/react';
import { Has, HasValue, getComponentValue } from '@dojoengine/recs';
import { useEffect, useMemo } from 'react';
import { validateAndParseAddress } from 'starknet';

export function useGetPlayers() {
  const {
    setup: {
      clientComponents: { Player },
    },
  } = useDojo();

  const sanitizePlayer = (player: any) => {
    return {
      index: player.index,
      game_id: player.game_id,
      address: validateAndParseAddress(player.address),
      cards: unpackU128toNumberArray(player.cards).filter((e: number) => e !== 0),
      conqueror: player.conqueror,
      name: feltToStr(player.name),
      supply: player.supply,
    };
  };

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
    console.log('players', players);
  }, [players]);

  return {
    players,
  };
}
