import GameState from '@/utils/gamestate';
import { useElementStore } from '@/utils/store';
import { Button } from './ui/button';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { HasValue, defineSystem } from '@dojoengine/recs';
import { useEffect } from 'react';
import { sanitizeGame } from '@/utils/sanitizer';
import { useDojo } from '@/dojo/useDojo';
import { useToast } from './ui/use-toast';

const Lobby: React.FC = () => {
  const {
    setup: {
      client: { host },
      clientComponents: { Game },
      world,
    },
    account: { account },
  } = useDojo();
  const { toast } = useToast();

  const { set_game_state, set_game_id, game_id, set_game } = useElementStore((state) => state);

  // Get game info
  const game = useComponentValue(Game, useEntityQuery([HasValue(Game, { id: game_id })]));

  const isHost = '0x' + game.host.toString(16) === account.address;

  useEffect(() => {
    defineSystem(world, [HasValue(Game, { id: game_id })], ({ value: [newGame] }: any) => {
      if (newGame.seed == 0) return; // Game has not started
      set_game(sanitizeGame(newGame));
      set_game_state(GameState.Game);
    });
  }, [game]);

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
        {isHost && <Button onClick={startGame}>Start</Button>}
      </p>
    </div>
  );
};

export default Lobby;
