import React from 'react';
import { TableRow, TableCell } from './ui/table';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { HasValue } from '@dojoengine/recs';
import { useDojo } from '@/DojoContext';
import { feltToStr } from '@/utils/unpack';

interface GameRowProps {
  game: {
    id: string;
    host: any;
    player_count: number;
    slots: number;
  };
}

const GameRow: React.FC<GameRowProps> = ({ game }) => {
  const {
    setup: {
      clientComponents: { Player },
    },
  } = useDojo();
  console.log(game);
  const playerId = useEntityQuery([HasValue(Player, { game_id: game.id, index: 0 })], { updateOnValueChange: true });
  console.log(playerId);
  const player = useComponentValue(Player, playerId[0]);
  console.log(player);

  return (
    <TableRow key={game.id}>
      <TableCell>{player ? feltToStr(player.name) : ''}</TableCell>
      <TableCell>{game.id}</TableCell>
      <TableCell>{`${game.player_count - game.slots} / ${game.player_count}`}</TableCell>
    </TableRow>
  );
};

export default GameRow;
