import { useEffect, useState } from 'react';
import { useGetPlayers } from './useGetPlayers';
import { useDojo } from '@/dojo/useDojo';
import { useTurn } from './useTurn';
import { Player } from '@/utils/types';

export function useMe(): { me: Player | null; isItMyTurn: boolean; setMe: any } {
  const {
    setup: {
      account: { account },
    },
  } = useDojo();
  const { turn } = useTurn();

  const [me, setMe] = useState<Player | null>(null);

  const { players } = useGetPlayers();

  useEffect(() => {
    if (players && players.length > 0 && account.address) {
      const me = players.find((p) => p.address === account.address);
      if (!me) return;
      setMe(me);
    }
  }, [account.address, players]);

  return {
    me,
    isItMyTurn: me?.index === turn,
    setMe,
  };
}
