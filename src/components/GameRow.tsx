import React from 'react';
import { TableRow, TableCell } from './ui/table';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { HasValue } from '@dojoengine/recs';
import { feltToStr } from '@/utils/unpack';
import { useElementStore } from '@/utils/store';
import GameState from '@/utils/gamestate';
import { useDojo } from '@/dojo/useDojo';
import { toast } from './ui/use-toast';
import { DialogCreateJoin } from './DialogCreateJoin';
import { useGetPlayersForGame } from '@/hooks/useGetPlayersForGame';

interface GameRowProps {
  game: {
    id: number;
    host: any;
    player_count: number;
    slots: number;
  };
  setPlayerName: (name: string) => void;
}

const GameRow: React.FC<GameRowProps> = ({ game, setPlayerName }) => {
  const {
    setup: {
      client: { host },
      clientComponents: { Player },
    },
    burnerManager: { account },
  } = useDojo();

  const { set_game_state, set_game_id, player_name } = useElementStore((state) => state);

  const playerId = useEntityQuery([HasValue(Player, { game_id: game.id, index: 0 })], { updateOnValueChange: true });
  const player = useComponentValue(Player, playerId[0]);
  const { players } = useGetPlayersForGame(game.id);

  const joinGame = async (gameid: number) => {
    if (account === null) return;

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
          <div className="px-2 rounded-full bg-stone-400">{`${players.length}/6`}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-end">
          <DialogCreateJoin
            onClick={() => joinGame(game.id)}
            playerName={player_name}
            setPlayerName={setPlayerName}
            dialogTitle={`Join Game ${game.id}`}
            buttonText="Join Game"
            buttonTextDisplayed="Join Game"
            isCreating={false}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default GameRow;
