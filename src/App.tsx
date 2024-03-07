import './App.css';
import ActionLogs from './components/ActionLogs';
import PlayPanel from './components/PlayPanel';
import Map from './components/map/Map';
import { Toaster } from './components/ui/toaster';

import GameState from './utils/gamestate';
import MainMenu from './components/MainMenu';
import Lobby from './components/Lobby';

import { TutorialProvider } from './contexts/TutorialContext';
import { useGetPlayers } from './hooks/useGetPlayers';
import { useElementStore } from './utils/store';
import PlayersPanel from './components/PlayersPanel';
import { DebugPanel } from './components/DebugPanel';
import OverlayEndGame from './components/OverlayEndGame';
import { useMe } from './hooks/useMe';
import DynamicOverlayTuto from './components/DynamicOverlayTuto';

function App() {
  // const { id } = useParams<{ id?: string }>();

  const { game_state } = useElementStore((state) => state);

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
  const { me, isItMyTurn } = useMe();

  return (
    <>
      <TutorialProvider>
        <Toaster />
        <div
          className="fixed top-0 left-0 z-30
      "
        >
          <DebugPanel />
        </div>
        {game_state === GameState.MainMenu && <MainMenu />}
        {game_state === GameState.Lobby && <Lobby />}
        {game_state === GameState.Game && (
          <>
            <div className="flex">
              <div className="w-full">
                <DynamicOverlayTuto
                  tutorialStep="STEP_5"
                  texts={['In the final phase, you can strategically reposition your troops between your owned tiles.']}
                >
                  <DynamicOverlayTuto
                    tutorialStep="STEP_4"
                    texts={[
                      'The second phase is the attack phase. Click on one of your tiles and an adjacent enemy tile to open the attack planning panel.',
                    ]}
                  >
                    <DynamicOverlayTuto
                      tutorialStep="STEP_2"
                      texts={[
                        'The initial phase is the supply phase, during which you must distribute all your cards to the tiles you control according to your chosen strategy.',
                      ]}
                    >
                      <Map />
                    </DynamicOverlayTuto>
                  </DynamicOverlayTuto>
                </DynamicOverlayTuto>
              </div>
            </div>
            <div className="fixed bottom-0 left-0 w-1/4 p-1">
              <DynamicOverlayTuto
                tutorialStep="STEP_7"
                texts={[
                  'This is the log window, where you can track game events. Hover over underlined text for additional details.',
                ]}
              >
                <ActionLogs />
              </DynamicOverlayTuto>
            </div>
            <div className="fixed bottom-0 right-0 w-1/4 pb-1 pr-1">
              <DynamicOverlayTuto
                tutorialStep="STEP_1"
                texts={['Here, you can view your opponents, the tiles they control, their cards, and their army size.']}
              >
                <PlayersPanel players={players} />
              </DynamicOverlayTuto>
            </div>
            <div className="flex justify-center">
              <PlayPanel />
            </div>
          </>
        )}
        {me && me.rank !== 0 && <OverlayEndGame me={me} players={players} />}
      </TutorialProvider>
    </>
  );
}

export default App;
