import GameState from '@/utils/gamestate';
import { useElementStore } from '@/utils/store';
import { Button } from './ui/button';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { HasValue } from '@dojoengine/recs';
import { useEffect } from 'react';
import { sanitizeGame } from '@/utils/sanitizer';
import { useDojo } from '@/dojo/useDojo';
import { useToast } from './ui/use-toast';

const Lobby: React.FC = () => {
  const {
    setup: {
      client: { host },
      clientComponents: { Game },
    },
    account: { account },
  } = useDojo();
  const { toast } = useToast();

  const { set_game_state, set_game_id, game_id, set_game } = useElementStore((state) => state);

  // Get game info
  const game = useComponentValue(Game, useEntityQuery([HasValue(Game, { id: game_id })]));

  useEffect(() => {
    if (game.seed != 0) {
      // Game has started
      set_game(sanitizeGame(game));
      set_game_state(GameState.Game);
    }
  }, [game]);

  const isHost = '0x' + game.host.toString(16) === account.address;

  const startGame = async () => {
    if (game_id === undefined) {
      console.error('Game id not defined');
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{'Game id not defined'}</code>,
      });
      return;
    }
    try {
      await host.start(account, game_id);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{error.message}</code>,
      });
    }
  };

  if (!game) {
    return;
  }

  return (
    <div className="flex gap-3 mb-4 items-center">
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
      <p>Max numbers: {game.player_count}</p>
      {isHost && <Button onClick={startGame}>Start</Button>}
      <h1 className="vt323-font text-white text-6xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        Waiting for the game to start
        <span className="inline-block animate-jump delay-100">.</span>
        <span className="inline-block animate-jump delay-200">.</span>
        <span className="inline-block animate-jump delay-300">.</span>
      </h1>
    </div>
  );
};

export default Lobby;
