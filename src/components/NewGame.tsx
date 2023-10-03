import { useDojo } from '@/DojoContext';
import { useElementStore } from '@/utils/store';
import { useState } from 'react';
import Modal from 'react-modal';
import { z } from 'zod';
import NewGameForm, { FormSchema } from './NewGameForm';
import { Button } from './ui/button';

const NewGame: React.FC = () => {
  const { ip } = useElementStore((state) => state);

  const {
    setup: {
      systemCalls: { create },
    },
    account: { account },
  } = useDojo();

  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const handleJoinClick = () => {
    setJoinModalVisible(true);
  };

  const handleCreateClick = () => {
    setCreateModalVisible(true);
  };

  const handleJoinModalClose = () => {
    setJoinModalVisible(false);
  };

  const handleCreateModalClose = () => {
    setCreateModalVisible(false);
  };

  function handleFormSubmit(data: z.infer<typeof FormSchema>) {
    console.log('Form data from child:', data);
    // You now have access to the form data and can process it as needed

    if (!ip) return;

    create(account, ip.toString(), 123, data.username, data.numberOfPlayers);
  }

  return (
    <>
      <Button onClick={handleJoinClick} className="mx-2">
        Join a game
      </Button>
      <Button onClick={handleCreateClick} className="mx-2">
        Create a new game
      </Button>

      {joinModalVisible && (
        <Modal isOpen={joinModalVisible} onRequestClose={handleJoinModalClose}>
          <div>Join game modal content goes here</div>
        </Modal>
      )}

      {createModalVisible && (
        <Modal
          style={{
            content: {
              width: '600px',
              height: '300px',
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              transform: 'translate(-50%, -50%)',
            },
          }}
          isOpen={createModalVisible}
          onRequestClose={handleCreateModalClose}
        >
          <NewGameForm onFormSubmit={handleFormSubmit} />
        </Modal>
      )}
    </>
  );
};

export default NewGame;
