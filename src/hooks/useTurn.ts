import { useElementStore } from '@/utils/store';
import { useEffect, useState } from 'react';

export const useTurn = () => {
  const { game } = useElementStore((state) => state);

  const [turn, setTurn] = useState<number>(0);

  useEffect(() => {
    if (game && game.nonce != null) {
      if (game && game.nonce !== undefined && Math.floor(game.nonce / 3) % game.player_count !== turn) {
        setTurn(Math.floor(game.nonce / 3) % game.player_count);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

  return {
    turn,
  };
};
