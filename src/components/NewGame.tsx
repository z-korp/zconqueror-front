import { useDojo } from '@/DojoContext';
import { formatStarkNetAddress } from '@/utils/sanitizer';
import { useElementStore } from '@/utils/store';
import { isTest } from '@/utils/test';
import { useState } from 'react';
import { z } from 'zod';
import { SidePanel } from './DebugPanel';
import JoinGameForm, { joinFormSchema } from './JoinGameForm';
import NewGameForm, { createFormSchema } from './NewGameForm';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const NewGame: React.FC = () => {
  const { game } = useElementStore((state) => state);

  const {
    setup: {
      client: { host },
    },
    account: { account },
  } = useDojo();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [gameIdInput, setGameIdInput] = useState('');

  async function handleCreateFormSubmit(data: z.infer<typeof createFormSchema>) {
    await host.create(account, data.username, data.numberOfPlayers);
    setCreateModalOpen(false);
  }

  async function handleJoinFormSubmit(data: z.infer<typeof joinFormSchema>) {
    await host.join(account, data.game_id, data.username);
    setJoinModalOpen(false);
  }

  const handleStartGame = () => {
    const gameId = parseInt(gameIdInput, 10);
    if (!isNaN(gameId)) {
      host.start(account, gameId);
      console.log('Starting game with ID:', gameId);
    }
  };

  return (
    <div className="flex gap-3 mb-4 absolute top-4 z-10 w-full">
      <SidePanel />
      <Dialog open={joinModalOpen} onOpenChange={(open) => setJoinModalOpen(open)}>
        <DialogTrigger asChild={true}>
          <Button className="drop-shadow-lg">Join a game</Button>
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

      <Dialog open={createModalOpen} onOpenChange={(open) => setCreateModalOpen(open)}>
        <DialogTrigger asChild={true}>
          <Button className="drop-shadow-lg">Create a new game</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new game</DialogTitle>
            <DialogDescription asChild={true}>
              <NewGameForm onFormSubmit={handleCreateFormSubmit} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {game && game.host === formatStarkNetAddress(account.address) && (
        <>
          <input
            id="inputGameId"
            type="text"
            value={gameIdInput}
            onChange={(e) => setGameIdInput(e.target.value)}
            placeholder=" Enter Game ID"
            className="pl-1 rounded-lg border-2 border-primary bg-black bg-opacity-30 backdrop-blur-md drop-shadow-lg"
          />
          <Button className="drop-shadow-lg" onClick={handleStartGame}>
            Start the game
          </Button>
        </>
      )}
      {account.address && (
        <div className="flex items-center">{`${account.address.substring(0, 5)}...${account.address.substring(
          account.address.length - 3
        )}`}</div>
      )}
      {isTest && game && <div className="flex items-center">{`Game id: ${game.id}`}</div>}
    </div>
  );
};

export default NewGame;
