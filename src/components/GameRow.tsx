import React from 'react';
import { TableRow, TableCell } from './ui/table';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { HasValue } from '@dojoengine/recs';
import { useDojo } from '@/DojoContext';
import { feltToStr } from '@/utils/unpack';
import { Button } from './ui/button';
import { useElementStore } from '@/utils/store';
import GameState from '@/utils/gamestate';

interface GameRowProps {
  game: {
    id: number;
    host: any;
    player_count: number;
    slots: number;
  };
}

const GameRow: React.FC<GameRowProps> = ({ game }) => {
  const {
    setup: {
      client: { host },
      clientComponents: { Player },
    },
    account,
  } = useDojo();

  const { set_game_state, set_game_id, player_name } = useElementStore((state) => state);

  console.log(game);
  const playerId = useEntityQuery([HasValue(Player, { game_id: game.id, index: 0 })], { updateOnValueChange: true });
  console.log(playerId);
  const player = useComponentValue(Player, playerId[0]);
  console.log(player);

  function joinGame(gameid: number) {
    host.join(account.account, gameid, player_name).then(() => {
      set_game_id(gameid);
      set_game_state(GameState.Lobby);
    });
  }

  return (
    <TableRow key={game.id}>
      <TableCell>{player ? feltToStr(player.name) : ''}</TableCell>
      <TableCell>{game.id}</TableCell>
      <TableCell>{`${game.player_count - game.slots} / ${game.player_count}`}</TableCell>
      <TableCell>
        <Button onClick={() => joinGame(game.id)}>Join Game</Button>
      </TableCell>
    </TableRow>
  );
};

export default GameRow;
