import { useEffect, useState } from 'react';
import { useGetPlayers } from './useGetPlayers';
import { useDojo } from '@/dojo/useDojo';
import { useTurn } from './useTurn';

export function useMe() {
  const {
    setup: {
      account: { account },
    },
  } = useDojo();
  const { turn } = useTurn();

  const [me, setMe] = useState<any | null>(null);

  const { players } = useGetPlayers();

  useEffect(() => {
    if (players.length > 0 && account.address) {
      const me = players.find((p) => p.address === account.address);
      if (!me) return;
      setMe(me);
    }
  }, [account.address, players]);

  return {
    me,
    isItMyTurn: me?.index === turn,
  };
}
