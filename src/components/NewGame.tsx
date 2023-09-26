import { useState } from "react";
import Modal from "react-modal";
import { Button } from "./ui/button";

interface NewGameProps {}

const NewGame: React.FC = () => {
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
          isOpen={createModalVisible}
          onRequestClose={handleCreateModalClose}
        >
          <div>Create game modal content goes here</div>
        </Modal>
      )}
    </>
  );
};

export default NewGame;
