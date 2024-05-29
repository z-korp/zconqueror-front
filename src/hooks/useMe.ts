import { useEffect, useState } from 'react';
import { useGetPlayers } from './useGetPlayers';
import { useTurn } from './useTurn';
import { Player } from '@/utils/types';
import { useAccount } from '@starknet-react/core';
import { removeLeadingZeros } from '@/utils/sanitizer';

export function useMe(): { me: Player | null; isItMyTurn: boolean } {
  const { account } = useAccount();
  const { turn } = useTurn();

  const [me, setMe] = useState<Player | null>(null);

  const { players } = useGetPlayers();

  useEffect(() => {
    if (players.length > 0 && account?.address) {
      const me = players.find((p) => p.address === removeLeadingZeros(account.address));
      if (!me) return;
      setMe(me);
    }
  }, [account?.address, players]);

  return {
    me,
    isItMyTurn: me?.index === turn,
  };
}
