import { useElementStore } from '@/utils/store';
import { z } from 'zod';
import { Button } from './ui/button';
import JoinGameForm, { joinFormSchema } from './JoinGameForm';
import GameState from '@/utils/gamestate';
import { Dialog, DialogContent, DialogDescription, DialogTrigger } from '@radix-ui/react-dialog';
import { DialogHeader } from './ui/dialog';
import { useEffect, useState } from 'react';
import { useDojo } from '@/dojo/useDojo';
import { useToast } from './ui/use-toast';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { Input } from './ui/input';
import { defineSystem, Has, HasValue, defineEnterSystem } from '@dojoengine/recs';
import { Table, TableBody, TableHead, TableHeader, TableRow } from './ui/table';
import GameRow from './GameRow';
import { world } from '@/dojo/world';

const MainMenu: React.FC = () => {
  const { toast } = useToast();
  const { set_game_state, set_game_id, player_name, setPlayerName } = useElementStore((state) => state);
  const [games, setGames] = useState<any[]>([]);

  const {
    setup: {
      client: { host },
      clientComponents: { Game },
    },
    account: { account },
  } = useDojo();

  const game = useComponentValue(Game, useEntityQuery([HasValue(Game, { host: BigInt(account.address) })]));

  // if player is host of a game, go to the lobby
  useEffect(() => {
    if (game) {
      set_game_id(game.id);
      set_game_state(GameState.Lobby);
    }
  }, [game]);

  const createNewGame = async () => {
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

  const handleJoinFormSubmit = async (data: z.infer<typeof joinFormSchema>) => {
    try {
      await host.join(account, data.game_id, player_name);
      set_game_id(data.game_id);
      set_game_state(GameState.Lobby);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{error.message}</code>,
      });
    }
  };

  useEffect(() => {
    defineEnterSystem(world, [HasValue(Game, { seed: BigInt(0) })], ({ value: [newGame] }: any) => {
      setGames((prevGames) => {
        if (prevGames.find((game) => game.id === newGame.id)) {
          return prevGames; // Return the previous games unchanged if newGame is already in games
        } else {
          return [...prevGames, newGame]; // Add newGame to games if it's not already in games
        }
      });
    });
    defineSystem(world, [Has(Game)], ({ value: [newGame] }: any) => {
      console.log('Game Updated', newGame);
      if (newGame.seed !== BigInt(0)) {
        setGames((prevGames) => prevGames.filter((game) => game.id !== newGame.id));
      }
    });
  }, []);

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <Input
          className="w-64"
          type="text"
          placeholder="Pseudo"
          value={player_name}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <Button onClick={createNewGame}>Create a new game</Button>
        <Dialog>
          <DialogTrigger asChild={true}>
            <Button>Join a game</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogDescription asChild={true}>
                <JoinGameForm onFormSubmit={handleJoinFormSubmit}></JoinGameForm>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <div className="flex justify-center">
          <div className="lg:w-1/2 md:w-3/4">
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
                {games.map((game) => (
                  <GameRow key={game.id} game={game} />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
