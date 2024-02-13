import { useDojo } from '@/DojoContext';
import { useElementStore } from '@/utils/store';
import { z } from 'zod';
import { Button } from './ui/button';
import JoinGameForm, { joinFormSchema } from './JoinGameForm';
import GameState from '@/utils/gamestate';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog';
import { DialogHeader } from './ui/dialog';
import { defineSystem, Has, HasValue, defineEnterSystem } from '@dojoengine/recs';
import { useEffect, useRef, useState } from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from './ui/table';
import GameRow from './GameRow';

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
  const [games, setGames] = useState<any[]>([]);
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
        host.create(burnerAccount, player_name);
      }, 500);
    }
  }, [account, accountInit, actionJoinData]);

  async function createNewGame() {
    prevAccount.current = account.account;
    setAccountInit(true);
    account.create();
  }

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

  async function handleJoinFormSubmit(data: z.infer<typeof joinFormSchema>) {
    prevAccount.current = account.account;
    setAccountInit(true);
    setActionJoinData(data);
    account.create();
  }

  return (
    <div>
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Host</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Players</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <GameRow key={game.id} game={game} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MainMenu;
