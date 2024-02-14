import { useElementStore } from '@/utils/store';
import { z } from 'zod';
import { Button } from './ui/button';
import JoinGameForm, { joinFormSchema } from './JoinGameForm';
import GameState from '@/utils/gamestate';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { DialogHeader } from './ui/dialog';
import { defineSystem, HasValue } from '@dojoengine/recs';
import { useState } from 'react';
import { useDojo } from '@/dojo/useDojo';
import { useToast } from './ui/use-toast';

const MainMenu: React.FC = () => {
  const { toast } = useToast();
  const { set_game_state, game_state, set_game_id } = useElementStore((state) => state);

  const {
    setup: {
      client: { host },
      clientComponents: { Game },
      world,
    },
    account: { account },
  } = useDojo();

  const [player_name, setPlayerName] = useState('Test');

  async function createNewGame() {
    defineSystem(world, [HasValue(Game, { host: BigInt(account.address) })], ({ value: [newGame] }: any) => {
      if (game_state === GameState.MainMenu) {
        set_game_id(newGame.id);
        set_game_state(GameState.Lobby);
      }
    });

    try {
      // TBD get the id from here?
      await host.create(account, player_name, /* price */ BigInt(0));
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{error.message}</code>,
      });
    }
  }

  async function handleJoinFormSubmit(data: z.infer<typeof joinFormSchema>) {
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
  }

  return (
    <div className="flex gap-3 mb-4">
      <input
        type="text"
        value={player_name}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter player name"
      />
      <Button onClick={createNewGame}>Create a new game</Button>
      <Dialog>
        <DialogTrigger asChild={true}>
          <Button>Join a game</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join a game</DialogTitle>
            <DialogDescription asChild={true}>
              <JoinGameForm onFormSubmit={handleJoinFormSubmit}></JoinGameForm>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainMenu;
