import { useDojo } from '@/DojoContext';
import { Phase, useElementStore } from '@/utils/store';
import { useState } from 'react';
import { z } from 'zod';
import NewGameForm, { createFormSchema } from './NewGameForm';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import JoinGameForm, { joinFormSchema } from './JoinGameForm';

const NewGame: React.FC = () => {
  const { set_current_state, set_game_id } = useElementStore((state) => state);

  const {
    setup: {
      systemCalls: { create, join },
    },
    account: { account },
  } = useDojo();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const setGameIdCallback = (gameId: number) => {
    set_game_id(gameId);
  };
  async function handleCreateFormSubmit(data: z.infer<typeof createFormSchema>) {
    create(account, data.username, data.numberOfPlayers, setGameIdCallback);
    set_current_state(Phase.DEPLOY);
    setCreateModalOpen(false);
  }

  async function handleJoinFormSubmit(data: z.infer<typeof joinFormSchema>) {
    join(account, data.game_id, data.username, setGameIdCallback);
    set_current_state(Phase.DEPLOY);
    setJoinModalOpen(false);
  }

  return (
    <div className="flex gap-3 mb-4">
      <Dialog open={joinModalOpen} onOpenChange={(open) => setJoinModalOpen(open)}>
        <DialogTrigger>
          <Button>Join a game</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join a game</DialogTitle>
            <DialogDescription>
              <JoinGameForm onFormSubmit={handleJoinFormSubmit}></JoinGameForm>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={createModalOpen} onOpenChange={(open) => setCreateModalOpen(open)}>
        <DialogTrigger>
          <Button>Create a new game</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new game</DialogTitle>
            <DialogDescription>
              <NewGameForm onFormSubmit={handleCreateFormSubmit} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewGame;
