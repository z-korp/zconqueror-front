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
        <Button variant="tertiary" onClick={createNewGame}>
          Create a new game
        </Button>
      </div>
      <div className="flex flex-col justify-center items-center gap-6">
        <div className="w-96 rounded-lg uppercase text-white text-4xl bg-stone-500">Zconqueror</div>
        <div className="bg-stone-500 p-10 rounded-lg lg:w-1/2 md:w-3/4">
          {games.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Host</TableHead>
                  <TableHead>
                    <div className="flex justify-center">ID</div>
                  </TableHead>
                  <TableHead>
                    <div className="flex justify-center">Players</div>
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="rounded-lg">
                {games.map((game: any) => (
                  <GameRow key={game.id} game={game} />
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
