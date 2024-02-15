import './App.css';
import ActionLogs from './components/ActionLogs';
import PlayPanel from './components/PlayPanel';
import Map from './components/map/Map';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';

import GameState from './utils/gamestate';
import MainMenu from './components/MainMenu';
import Lobby from './components/Lobby';

import { useGetPlayers } from './hooks/useGetPlayers';
import { useElementStore } from './utils/store';
import PlayersPanel from './components/PlayersPanel';
import { DebugPanel } from './components/DebugPanel';
import { createClient } from 'graphql-ws';

function App() {
  // const { id } = useParams<{ id?: string }>();

  const { game_state } = useElementStore((state) => state);
  const wsClient = createClient({ url: import.meta.env.VITE_PUBLIC_TORII_WS });

  console.log('wsClient', wsClient);

  // useEffect(() => {
  //   console.log('URL ID:', id);
  //   if (id !== undefined) {
  //     // Get the game with the ID from the URL
  //     defineSystem(world, [HasValue(Game, { id: Number(id) })], ({ value: [newGame] }: any) => {
  //       console.log('newGame', newGame);
  //       set_game(sanitizeGame(newGame));
  //     });
  //   } else {
  //     // Get the game that the user is hosting, if any
  //     defineSystem(world, [HasValue(Game, { host: BigInt(account.address) })], ({ value: [newGame] }: any) => {
  //       console.log('newGame', newGame);
  //       set_game(sanitizeGame(newGame));
  //     });
  //   }
  // }, [account]);

  const { players } = useGetPlayers();

  return (
    <>
      <Toaster />
      <div className="fixed top-0 left-0 z-[1000]">
        <DebugPanel />
      </div>
      {game_state === GameState.MainMenu && <MainMenu />}
      {game_state === GameState.Lobby && <Lobby />}
      {game_state === GameState.Game && (
        <>
          <div className="flex">
            <div className="w-full">
              <Map />
            </div>
          </div>
          <div className="flex justify-center">
            <PlayPanel />
          </div>
          <div className="fixed bottom-0 left-0 w-1/4 p-1">
            <ActionLogs />
          </div>
          <div className="fixed bottom-0 right-0 w-1/4 pr-1 pb-1">
            <PlayersPanel players={players} />
          </div>
        </>
      )}
    </>
  );
}

export default App;
