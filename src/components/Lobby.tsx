import { useDojo } from '@/DojoContext';
import GameState from '@/utils/gamestate';
import { useElementStore } from '@/utils/store';
import { Button } from './ui/button';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { HasValue } from '@dojoengine/recs';

const Lobby: React.FC = () => {
    const {
        setup: {
            client: { host },
            clientComponents: { Game, Player }
        },
        account: { account },
    } = useDojo();

    const { set_game_state, set_game_id, game_id } = useElementStore((state) => state);

    // Get game info
    const game = useComponentValue(Game, useEntityQuery([HasValue(Game, { id: game_id })]));
    if (!game) {
        return
    }
    const isHost = '0x' + game.host.toString(16) === account.address

    const playersId = useEntityQuery([HasValue(Player, { game_id })])
    const players = []
    for (const playerId of playersId) {
        players.push(useComponentValue(Player, playerId))
    }

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
            <h2>
                Game id: { game_id }
            </h2>
            <p>
                Max numbers: { game.player_count }
                {
                    isHost && 
                    <>
                        <Button>Change Player Limit</Button>
                        <Button onClick={startGame}>Start</Button>
                    </>
                }
            </p>

            <div className="flex gap-3 mb-4">
            {
                players.map((p) => {
                    return (
                        <p key={p.address}>{p.address}</p>
                    )
                })
            }
            </div>
        </div >
    );
};

export default Lobby;
