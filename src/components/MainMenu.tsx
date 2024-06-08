import { useElementStore } from '@/utils/store';
import GameState from '@/utils/gamestate';
import { useEffect, useMemo, useState } from 'react';
import { useDojo } from '@/dojo/useDojo';
import { useToast } from './ui/use-toast';
import { useComponentValue, useEntityQuery } from '@dojoengine/react';
import { HasValue, getComponentValue } from '@dojoengine/recs';
import { Table, TableBody, TableHead, TableHeader, TableRow } from './ui/table';
import GameRow from './GameRow';
import { DialogCreateJoin } from './DialogCreateJoin';
import WalletButton from './WalletButton';

const MainMenu: React.FC = () => {
  const { toast } = useToast();
  const { set_game_state, set_game_id, player_name, setPlayerName, round_limit, setRoundLimit } = useElementStore(
    (state) => state
  );

  const {
    setup: {
      client: { host },
      clientComponents: { Game, Player },
    },
    account: { account },
  } = useDojo();

  const game = useComponentValue(Game, useEntityQuery([HasValue(Game, { host: BigInt(account.address) })]));
  const player = useComponentValue(Player, useEntityQuery([HasValue(Player, { address: BigInt(account.address) })]));

  const [hours, setHours] = useState<number | null>(null);
  const [minutes, setMinutes] = useState(5);

  // if player is host of a game, go to the lobby
  useEffect(() => {
    if (player) {
      set_game_id(player.game_id);
      set_game_state(GameState.Lobby);
    } else if (game) {
      set_game_id(game.id);
      set_game_state(GameState.Lobby);
    }
  }, [game, player]);

  const createNewGame = async () => {
    if (!player_name) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{'Please enter a pseudo'}</code>,
      });
      return;
    }

    try {
      const totalSeconds = hours ? hours * 3600 + minutes * 60 : minutes * 60;
      await host.create(account, player_name, /* price */ BigInt(0), /* penalty*/ totalSeconds);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{error.message}</code>,
      });
    }
  };

  const gameEntities: any = useEntityQuery([HasValue(Game, { seed: BigInt(0) })]);
  const games = useMemo(
    () =>
      gameEntities
        .map((id: any) => getComponentValue(Game, id))
        .sort((a: any, b: any) => b.id - a.id)
        .filter((game: any) => game.host !== 0n),
    [gameEntities, Game]
  );

  if (!games) return null;
  return (
    <div className="font-vt323">
      <div className="flex flex-col justify-center items-center gap-6">
        <div className="w-full relative h-16">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-96 rounded-lg uppercase text-white text-4xl bg-stone-500 text-center">
            zConqueror
          </div>
          <div className="absolute right-0">
            <WalletButton />
          </div>
        </div>
        {games.length === 0 && (
          <DialogCreateJoin
            onClick={createNewGame}
            playerName={player_name}
            setPlayerName={setPlayerName}
            dialogTitle="Create a new game"
            buttonText="Create"
            buttonTextDisplayed="Create a New Game"
            hours={hours}
            setHours={(value: number | null) => setHours(value)}
            minutes={minutes}
            setMinutes={setMinutes}
            limit={round_limit}
            setLimit={(value: number) => setRoundLimit(value)}
            isCreating={true}
          />
        )}
        {games.length > 0 && (
          <div className="flex flex-col w-5/6 max-w-4xl bg-stone-500 p-7 pt-4 rounded-lg">
            <Table className="text-lg">
              <TableHeader>
                <TableRow>
                  <TableHead>Host</TableHead>
                  <TableHead>
                    <div className="flex justify-center">ID</div>
                  </TableHead>
                  <TableHead>
                    <div className="flex justify-center">Players</div>
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="rounded-lg">
                {games.map((game: any) => (
                  <GameRow key={game.id} game={game} setPlayerName={setPlayerName} />
                ))}
              </TableBody>
            </Table>

            <div className="w-fit mt-8 self-end">
              <DialogCreateJoin
                onClick={createNewGame}
                playerName={player_name}
                setPlayerName={setPlayerName}
                dialogTitle="Create a new game"
                buttonText="Create"
                buttonTextDisplayed="Create a New Game"
                hours={hours}
                setHours={setHours}
                minutes={minutes}
                setMinutes={setMinutes}
                limit={round_limit}
                setLimit={(value: number) => setRoundLimit(value)}
                isCreating={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainMenu;
