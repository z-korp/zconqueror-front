import { useElementStore } from '@/utils/store';
import { Button } from './ui/button';
import GameState from '@/utils/gamestate';
import { useEffect, useMemo } from 'react';
import { useDojo } from '@/dojo/useDojo';
import { useToast } from './ui/use-toast';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { Input } from './ui/input';
import { HasValue, getComponentValue } from '@dojoengine/recs';
import { Table, TableBody, TableHead, TableHeader, TableRow } from './ui/table';
import GameRow from './GameRow';

const MainMenu: React.FC = () => {
  const { toast } = useToast();
  const { set_game_state, set_game_id, player_name, setPlayerName } = useElementStore((state) => state);

  const {
    setup: {
      client: { host },
      clientComponents: { Game, Player },
    },
    account: { account },
  } = useDojo();

  const game = useComponentValue(Game, useEntityQuery([HasValue(Game, { host: BigInt(account.address) })]));
  const player = useComponentValue(Player, useEntityQuery([HasValue(Player, { address: BigInt(account.address) })]));

  // if player is host of a game, go to the lobby
  useEffect(() => {
    if (player) {
      set_game_id(player.game_id);
      set_game_state(GameState.Lobby);
    } else if (game) {
      set_game_id(game.id);
      set_game_state(GameState.Lobby);
    }
  }, [game, player]);

  const createNewGame = async () => {
    if (!player_name) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{'Please enter a pseudo'}</code>,
      });
      return;
    }

    try {
      // TBD get the id from here?
      await host.create(account, player_name, /* price */ BigInt(0));
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{error.message}</code>,
      });
    }
  };

  const gameEntities: any = useEntityQuery([HasValue(Game, { seed: BigInt(0) })]);
  const games = useMemo(
    () =>
      gameEntities
        .map((id: any) => getComponentValue(Game, id))
        .sort((a: any, b: any) => b.id - a.id)
        .filter((game: any) => game.host !== 0n),
    [gameEntities, Game]
  );
  // console.log('games', games);
  // console.log('gamesLengts', games.length);
  // const game1 = games.map((game: any) => console.log('game', game));
  if (!games) return null;
  return (
    <div className="vt323-font">
      <div className="flex gap-3 mb-4">
        <Input
          className="w-64"
          type="text"
          placeholder="Pseudo"
          value={player_name}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <Button onClick={createNewGame}>Create a new game</Button>
      </div>
      <div className="flex justify-center">
        <div className="lg:w-1/2 md:w-3/4">
          {games.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Host</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Players</TableHead>
                  <TableHead>Join</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {games.map((game: any) => (
                  <>
                    <GameRow key={game.id} game={game} />
                  </>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
