import { useState } from "react";
import Modal from "react-modal";
import { Button } from "./ui/button";
import NewGameModal from "./lobby/NewGameModal";
import JoinGameModal from "./lobby/JoinGameModal";

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

  const handleCreateGame = () => {
    // Implement creating the game with the selected options
  };

  return (
    <>
      <Button onClick={handleJoinClick} className="mx-2">
        Join a game
      </Button>
      <Button onClick={handleCreateClick} className="mx-2">
        Create a new game
      </Button>

      <JoinGameModal
        isOpen={joinModalVisible}
        onRequestClose={handleJoinModalClose}
      />

      <NewGameModal
        isOpen={createModalVisible}
        onRequestClose={handleCreateModalClose}
        onCreateGame={handleCreateGame}
      />
    </>
  );
};

export default NewGame;
