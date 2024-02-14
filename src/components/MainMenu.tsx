import { useElementStore } from '@/utils/store';
import { z } from 'zod';
import { Button } from './ui/button';
import JoinGameForm, { joinFormSchema } from './JoinGameForm';
import GameState from '@/utils/gamestate';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { DialogHeader } from './ui/dialog';
import { HasValue } from '@dojoengine/recs';
import { useEffect, useState } from 'react';
import { useDojo } from '@/dojo/useDojo';
import { useToast } from './ui/use-toast';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { Input } from './ui/input';

const MainMenu: React.FC = () => {
  const { toast } = useToast();
  const { set_game_state, set_game_id } = useElementStore((state) => state);

  const {
    setup: {
      client: { host },
      clientComponents: { Game },
    },
    account: { account },
  } = useDojo();

  const [player_name, setPlayerName] = useState('Test');

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

  return (
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
    </div>
  );
};

export default MainMenu;
