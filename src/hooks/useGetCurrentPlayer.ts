import { useEffect, useState } from 'react';
import { useGetPlayers } from './useGetPlayers';
import { useTurn } from './useTurn';

export function useGetCurrentPlayer() {
  const [currentPlayer, setCurrentPlayer] = useState<any | null>(null);

  const { turn } = useTurn();
  const { players } = useGetPlayers();

  useEffect(() => {
    if (players.length > 0 && turn < players.length) {
      setCurrentPlayer(players[turn]);
    }
  }, [turn, players]);

  /*useEffect(() => {
    console.log('currentPlayer', currentPlayer);
  }, [currentPlayer]);*/

  return {
    currentPlayer,
  };
}
