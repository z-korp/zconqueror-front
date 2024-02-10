import { useDojo } from '@/DojoContext';
import GameState from '@/utils/gamestate';
import { useElementStore } from '@/utils/store';
import { Button } from './ui/button';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { HasValue, defineSystem } from '@dojoengine/recs';
import { useEffect, useState } from 'react';

const Lobby: React.FC = () => {
    const {
        setup: {
            client: { host },
            clientComponents: { Game, Player },
            world,
        },
        account: { account },
    } = useDojo();

    const { set_game_state, set_game_id, game_id } = useElementStore((state) => state);
    const [players, setPlayers] = useState<any>({}) 

    // Get game info
    const game = useComponentValue(Game, useEntityQuery([HasValue(Game, { id: game_id })]));
    if (!game) {
        return
    }
    const isHost = '0x' + game.host.toString(16) === account.address

    useEffect(() => {
        defineSystem(world, [HasValue(Player, { game_id })], ({ value: [newValue]}: any) => {
            setPlayers((prevPlayers :any) => {
                console.log(newValue, {
                    ...prevPlayers,
                    [newValue.address]: newValue
                })
                return {
                    ...prevPlayers,
                    [newValue.address]: newValue
                }
            })
        })
    }, [])

    const startGame = async () => {
        if (game_id === undefined) {
            console.error("Game id not defined")
            return
        }
        console.log("starts with ", account)
        await host.start(account, game_id);
        console.log('Starting game with ID:', game_id);
        set_game_state(GameState.Game)
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
                Object.values(players).map((p: any) => {
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
