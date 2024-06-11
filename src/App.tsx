import { Toaster } from './components/ui/toaster';
import GameState from './utils/gamestate';
import MainMenu from './components/MainMenu';
import Lobby from './components/Lobby';
import { TutorialProvider } from './contexts/TutorialContext';
import { useGetPlayers } from './hooks/useGetPlayers';
import { useElementStore } from './utils/store';
import { DebugPanel } from './components/DebugPanel';
import OverlayEndGame from './components/OverlayEndGame';
import { useMe } from './hooks/useMe';
import OverlayBattleReport from './components/BattleReport/OverlayBattleReport';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Game from './components/Game';

import './styles/App.css';

function App() {
  // const { id } = useParams<{ id?: string }>();

  const { game_state, battleReport, setBattleReport } = useElementStore((state) => state);

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
  const { me } = useMe();

  return (
    <>
      <TutorialProvider>
        <Toaster />
        {battleReport && <OverlayBattleReport battle={battleReport} onClose={() => setBattleReport(null)} />}
        <div className="fixed top-0 left-0 z-30">
          <DebugPanel />
        </div>
        {game_state === GameState.MainMenu && <MainMenu />}
        {game_state === GameState.Lobby && <Lobby />}
        {game_state === GameState.Game && <Game />}
        {me && me.rank !== 0 && <OverlayEndGame me={me} players={players} />}
      </TutorialProvider>
      <SpeedInsights />
    </>
  );
}

export default App;
