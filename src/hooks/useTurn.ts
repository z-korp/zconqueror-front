import { useEffect, useState } from 'react';
import { useGame } from './useGame';

export const useTurn = () => {
  const game = useGame();
  const [turn, setTurn] = useState<number>(1);

  useEffect(() => {
    if (game && game.nonce != null && game.nonce !== undefined) {
      if (Math.floor(game.nonce / 3) % game.player_count !== turn) {
        setTurn(Math.floor(game.nonce / 3) % game.player_count);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

  useEffect(() => {
    //console.log('turn', turn);
  }, [turn]);

  return {
    turn,
  };
};
