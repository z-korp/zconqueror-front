import { useDojo } from '@/DojoContext';
import GameState from '@/utils/gamestate';
import { useElementStore } from '@/utils/store';
import { Button } from './ui/button';
const Lobby: React.FC = () => {
    const {
        setup: {
            client: { host },
        },
        account: { account },
    } = useDojo();

    const { set_game_state, set_game_id, game_id } = useElementStore((state) => state);

    const startGame = () => {
        if (!game_id) {
            console.error("Game id not defined")
            return
        }
        console.log("starts with ", account)
        host.start(account, game_id);
        console.log('Starting game with ID:', game_id);
    };

    return (
        <div className="flex gap-3 mb-4">
            <Button onClick={() => {
                set_game_id(0)
                set_game_state(GameState.MainMenu)
            }}>Back</Button>
            Lobby
            <p>
                Nb players: 4
            </p >
            <Button onClick={startGame}>Start</Button>

            {/* {game_creator && (
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
            )} */}
        </div >
    );
};

export default Lobby;
