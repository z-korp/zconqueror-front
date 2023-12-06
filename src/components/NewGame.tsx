import { useDojo } from '@/DojoContext';
import { Phase, useElementStore } from '@/utils/store';
import { useState } from 'react';
import { z } from 'zod';
import NewGameForm, { FormSchema } from './NewGameForm';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const NewGame: React.FC = () => {
  const { set_current_state, set_game_id } = useElementStore((state) => state);

  const {
    setup: {
      systemCalls: { create },
    },
    account: { account },
  } = useDojo();

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const setGameIdCallback = (gameId: number) => {
    set_game_id(gameId);
  };
  async function handleFormSubmit(data: z.infer<typeof FormSchema>) {
    create(account, data.username, data.numberOfPlayers, setGameIdCallback);
    set_current_state(Phase.DEPLOY);
    setCreateModalOpen(false);
  }

  return (
    <div className="flex gap-3 mb-4">
      <Dialog>
        <DialogTrigger>
          <Button>Join a game</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join a game</DialogTitle>
            <DialogDescription></DialogDescription>
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
              <NewGameForm onFormSubmit={handleFormSubmit} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewGame;
