import { useState } from "react";
import Modal from "react-modal";

interface NewGameModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onCreateGame: (
    gameName: string,
    numPlayers: number,
    paidGame: boolean,
    bidAmount: number,
    password: string
  ) => void;
}

const NewGameModal: React.FC<NewGameModalProps> = ({
  isOpen,
  onRequestClose,
  onCreateGame,
}) => {
  const [gameName, setGameName] = useState("");
  const [numPlayers, setNumPlayers] = useState(2);
  const [paidGame, setPaidGame] = useState(false);
  const [bidAmount, setBidAmount] = useState(1);
  const [password, setPassword] = useState("");

  const handleCreateGame = () => {
    onCreateGame(gameName, numPlayers, paidGame, bidAmount, password);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-base"
    >
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Create a new game</h2>
        <div className="flex flex-col mb-4">
          <label htmlFor="gameName" className="mb-2 font-bold">
            Game name:
          </label>
          <input
            type="text"
            id="gameName"
            name="gameName"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="border border-gray-400 p-2 rounded-lg"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="numPlayers" className="mb-2 font-bold">
            Number of players (max 8):
          </label>
          <input
            type="number"
            id="numPlayers"
            name="numPlayers"
            min="2"
            max="8"
            value={numPlayers}
            onChange={(e) => setNumPlayers(parseInt(e.target.value))}
            className="border border-gray-400 p-2 rounded-lg"
          />
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="paidGame"
            name="paidGame"
            checked={paidGame}
            onChange={(e) => setPaidGame(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="paidGame" className="font-bold">
            Paid game
          </label>
        </div>
        {paidGame && (
          <div className="flex flex-col mb-4">
            <label htmlFor="bidAmount" className="mb-2 font-bold">
              Bid amount:
            </label>
            <input
              type="number"
              id="bidAmount"
              name="bidAmount"
              min="1"
              max="100"
              value={bidAmount}
              onChange={(e) => setBidAmount(parseInt(e.target.value))}
              className="border border-gray-400 p-2 rounded-lg"
            />
          </div>
        )}
        <div className="flex flex-col mb-4">
          <label htmlFor="password" className="mb-2 font-bold">
            Password (optional):
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-400 p-2 rounded-lg"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleCreateGame}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Create game
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NewGameModal;
