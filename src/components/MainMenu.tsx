import { useDojo } from '@/DojoContext';
import { useElementStore } from '@/utils/store';
import { z } from 'zod';
import { Button } from './ui/button';
import JoinGameForm, { joinFormSchema } from './JoinGameForm';
import GameState from '@/utils/gamestate';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { DialogHeader } from './ui/dialog';
import { defineSystem, HasValue } from '@dojoengine/recs';
import { useEffect, useRef, useState } from 'react';

const MainMenu: React.FC = () => {
  const { set_game_state, game_state, set_game_id } = useElementStore((state) => state);

  const {
    setup: {
      client: { host },
      clientComponents: { Game },
      world,
    },
    account,
  } = useDojo();

  const prevAccount = useRef<any>();

  const [accountInit, setAccountInit] = useState<boolean>(false);
  const [actionJoinData, setActionJoinData] = useState<any>(undefined);
  const [player_name, setPlayerName] = useState('');

  useEffect(() => {
    if (!accountInit || prevAccount.current.address === account.account.address) {
      return;
    }

    const burnerAccount = account.account;
    if (actionJoinData) {
      setTimeout(() => {
        host.join(burnerAccount, actionJoinData.game_id, player_name).then(() => {
          set_game_id(actionJoinData.game_id);
          set_game_state(GameState.Lobby);
        });
      }, 500);
    } else {
      defineSystem(world, [HasValue(Game, { host: BigInt(burnerAccount.address) })], ({ value: [newGame] }: any) => {
        if (game_state === GameState.MainMenu) {
          set_game_id(newGame.id);
          set_game_state(GameState.Lobby);
        }
      });
      setTimeout(() => {
        console.log('create with', burnerAccount.address);
        host.create(burnerAccount, player_name);
      }, 500);
    }
  }, [account, accountInit, actionJoinData]);

  async function createNewGame() {
    prevAccount.current = account.account;
    setAccountInit(true);
    account.create();
  }

  async function handleJoinFormSubmit(data: z.infer<typeof joinFormSchema>) {
    prevAccount.current = account.account;
    setAccountInit(true);
    setActionJoinData(data);
    account.create();
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
