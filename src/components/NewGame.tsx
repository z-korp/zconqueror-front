import { useDojo } from '@/DojoContext';
import { Phase, useElementStore } from '@/utils/store';
import { useState } from 'react';
import { z } from 'zod';
import NewGameForm, { createFormSchema } from './NewGameForm';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import JoinGameForm, { joinFormSchema } from './JoinGameForm';
import { SidePanel } from './DebugPanel';

const NewGame: React.FC = () => {
  const { set_current_state, set_game_creator, game_creator } = useElementStore((state) => state);

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
    host.create(account, data.username, data.numberOfPlayers);
    set_game_creator(true);
    set_current_state(Phase.DEPLOY);
    setCreateModalOpen(false);
  }

  async function handleJoinFormSubmit(data: z.infer<typeof joinFormSchema>) {
    host.join(account, data.game_id, data.username);
    set_current_state(Phase.DEPLOY);
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
    <div className="flex gap-3 mb-4">
      <SidePanel />
      <Dialog open={joinModalOpen} onOpenChange={(open) => setJoinModalOpen(open)}>
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

      <Dialog open={createModalOpen} onOpenChange={(open) => setCreateModalOpen(open)}>
        <DialogTrigger asChild={true}>
          <Button>Create a new game</Button>
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
      {game_creator && (
        <>
          <input
            id="inputGameId"
            type="text"
            value={gameIdInput}
            onChange={(e) => setGameIdInput(e.target.value)}
            placeholder="Enter Game ID"
          />
          <Button onClick={handleStartGame}>Start the game</Button>
        </>
      )}
    </div>
  );
};

export default NewGame;
