import GameState from '@/utils/gamestate';
import { useElementStore } from '@/utils/store';
import { Button } from './ui/button';
import { useEffect } from 'react';
import { formatStarkNetAddress } from '@/utils/sanitizer';
import { useDojo } from '@/dojo/useDojo';
import { useToast } from './ui/use-toast';
import { useGetPlayersForGame } from '@/hooks/useGetPlayersForGame';
import { useGame } from '@/hooks/useGame';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from './ui/table';

const Lobby: React.FC = () => {
  const {
    setup: {
      client: { host },
    },
    account: { account },
  } = useDojo();
  const { toast } = useToast();

  const { set_game_state, set_game_id, game_id } = useElementStore((state) => state);

  const game = useGame();

  const { players } = useGetPlayersForGame(game_id);

  useEffect(() => {
    if (game && Number(game.seed.toString(16)) !== 0) {
      // Game has started
      set_game_state(GameState.Game);
    }
  }, [game?.seed]);

  const isHost = (host: string, address: string) => {
    return host === formatStarkNetAddress(address);
  };

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

  const leaveGame = async (game_id: number) => {
    try {
      await host.leave(account, game_id);
      set_game_id(0);
      set_game_state(GameState.MainMenu);
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
    <div>
      <div className="flex gap-3 mb-2 items-center">
        <Button
          onClick={async () => {
            if (game.id !== undefined) {
              await leaveGame(game.id);
            }
          }}
        >
          Back
        </Button>
        Lobby
        <h2>Game id: {game.id}</h2>
        <p>
          Players: {players.length}/{game.player_count}
        </p>
        {isHost(game.host, account.address) && <Button onClick={startGame}>Start</Button>}
        <h1 className="vt323-font text-white text-6xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Waiting for the game to start
          <span className="inline-block animate-jump delay-100">.</span>
          <span className="inline-block animate-jump delay-200">.</span>
          <span className="inline-block animate-jump delay-300">.</span>
        </h1>
      </div>
      <div className="flex justify-center">
        <div>
          {players.length !== 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player: any) => (
                  <TableRow key={player.address}>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>
                      {
                        <div className="flex gap-3 items-center">
                          <span>{player.address} </span>{' '}
                          <div>
                            {!isHost(game.host, player.address) && (
                              <Button onClick={() => console.log(`Kick ${player.name}`)}>Kick</Button>
                            )}
                          </div>
                        </div>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lobby;
