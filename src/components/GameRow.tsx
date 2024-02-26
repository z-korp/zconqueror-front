import React from 'react';
import { TableRow, TableCell } from './ui/table';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { HasValue } from '@dojoengine/recs';
import { feltToStr } from '@/utils/unpack';
import { Button } from './ui/button';
import { useElementStore } from '@/utils/store';
import GameState from '@/utils/gamestate';
import { useDojo } from '@/dojo/useDojo';
import { toast } from './ui/use-toast';

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
    account: { account },
  } = useDojo();

  const { set_game_state, set_game_id, player_name } = useElementStore((state) => state);

  const playerId = useEntityQuery([HasValue(Player, { game_id: game.id, index: 0 })], { updateOnValueChange: true });
  const player = useComponentValue(Player, playerId[0]);

  const joinGame = async (gameid: number) => {
    if (!player_name) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{'Please enter a pseudo'}</code>,
      });
      return;
    }
    try {
      await host.join(account, gameid, player_name);
      set_game_id(gameid);
      set_game_state(GameState.Lobby);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{error.message}</code>,
      });
    }
  };

  return (
    <TableRow key={game.id}>
      <TableCell>{player ? feltToStr(player.name) : ''}</TableCell>
      <TableCell>{game.id}</TableCell>
      <TableCell>
        <div className="flex items-center justify-center">
          <div className="px-2 rounded-full bg-stone-400">{`${game.player_count}/6`}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-end">
          <Button variant="tertiary" className="hover:bg-green-600" onClick={() => joinGame(game.id)}>
            Join Game
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default GameRow;
