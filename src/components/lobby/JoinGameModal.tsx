import { useState } from "react";
import Modal from "react-modal";

interface JoinGameModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const JoinGameModal: React.FC<JoinGameModalProps> = ({
  isOpen,
  onRequestClose,
}) => {
  const [games, setGames] = useState([
    {
      name: "Game 1",
      numPlayers: 4,
      paidGame: false,
      bidAmount: 0,
      password: "",
    },
    {
      name: "Game 2",
      numPlayers: 6,
      paidGame: true,
      bidAmount: 10,
      password: "",
    },
    {
      name: "Game 3",
      numPlayers: 8,
      paidGame: true,
      bidAmount: 5,
      password: "password",
    },
  ]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-base"
    >
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Join a game</h2>
        {games.length === 0 ? (
          <div>No games available</div>
        ) : (
          <ul className="list-disc pl-4">
            {games.map((game, index) => (
              <li key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold">{game.name}</div>
                  <div className="text-sm">
                    {game.numPlayers} players |{" "}
                    {game.paidGame ? `$${game.bidAmount}` : "Free"}
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="password"
                    placeholder="Password"
                    className="border border-gray-400 p-2 rounded-lg mr-2"
                  />
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    Join
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
};

export default JoinGameModal;
