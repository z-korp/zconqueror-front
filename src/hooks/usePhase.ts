import { Phase, useElementStore } from '@/utils/store';
import { useEffect, useState } from 'react';

export const usePhase = () => {
  const { game } = useElementStore((state) => state);

  const [phase, setPhase] = useState<Phase>(Phase.DEPLOY);

  useEffect(() => {
    if (game && game.nonce != null && game.nonce !== undefined) {
      setPhase(Math.floor(game.nonce % 3));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

  useEffect(() => {
    //console.log('phase', phase);
  }, [phase]);

  return {
    phase,
  };
};
