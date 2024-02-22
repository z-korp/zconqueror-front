import { Phase, useElementStore } from '@/utils/store';
import { useEffect, useState } from 'react';
import { useGame } from './useGame';

const getPhaseName = (phase: Phase): string => {
  switch (phase) {
    case Phase.DEPLOY:
      return 'Deploy';
    case Phase.ATTACK:
      return 'Attack';
    case Phase.FORTIFY:
      return 'Fortify';
    default:
      return '';
  }
};

export const usePhase = () => {
  const game = useGame();

  const [phase, setPhase] = useState<Phase>(Phase.DEPLOY);
  const [phaseName, setPhaseName] = useState<string>('Deploy');

  useEffect(() => {
    if (game && game.nonce != null && game.nonce !== undefined) {
      const calculatedPhase = Math.floor(game.nonce % 3);
      setPhase(calculatedPhase);
      setPhaseName(getPhaseName(calculatedPhase));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

  useEffect(() => {
    //console.log('phase', phase);
  }, [phase]);

  return {
    phase,
    phaseName,
  };
};
