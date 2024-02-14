import { useDojo } from '@/DojoContext';
import GameState from '@/utils/gamestate';
import { useElementStore } from '@/utils/store';
import { Button } from './ui/button';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { HasValue, defineSystem } from '@dojoengine/recs';
import { useEffect } from 'react';
import { sanitizeGame } from '@/utils/sanitizer';

const Lobby: React.FC = () => {
  const {
    setup: {
      client: { host },
      clientComponents: { Game },
      world,
    },
    account: { account },
  } = useDojo();

  const { set_game_state, set_game_id, game_id, set_game } = useElementStore((state) => state);

  // Get game info
  const game = useComponentValue(Game, useEntityQuery([HasValue(Game, { id: game_id })]));
  if (!game) {
    return;
  }
  const isHost = '0x' + game.host.toString(16) === account.address;

  useEffect(() => {
    defineSystem(world, [HasValue(Game, { id: game_id })], ({ value: [newGame] }: any) => {
      if (newGame.seed == 0) return; // Game has not started
      set_game(sanitizeGame(newGame));
      set_game_state(GameState.Game);
    });
  }, []);

  const startGame = async () => {
    if (game_id === undefined) {
      console.error('Game id not defined');
      return;
    }
    await host.start(account, game_id);
  };

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <div className="flex gap-3 mb-4">
        <Button
          onClick={() => {
            set_game_id(0);
            set_game_state(GameState.MainMenu);
          }}
        >
          Back
        </Button>
        Lobby
        <h2>Game id: {game_id}</h2>
        <p>
          Max numbers: {game.player_count}
          {isHost && (
            <>
              <Button>Change Player Limit</Button>
              <Button onClick={startGame}>Start</Button>
            </>
          )}
        </p>
      </div>
      <h1 className="vt323-font text-white text-6xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        Waiting for the game to start ...
      </h1>
    </div>
  );
};

export default Lobby;
