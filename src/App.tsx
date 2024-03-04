import './App.css';
import ActionLogs from './components/ActionLogs';
import PlayPanel from './components/PlayPanel';
import Map from './components/map/Map';
import { Toaster } from './components/ui/toaster';

import GameState from './utils/gamestate';
import MainMenu from './components/MainMenu';
import Lobby from './components/Lobby';

import { useGetPlayers } from './hooks/useGetPlayers';
import { useElementStore } from './utils/store';
import PlayersPanel from './components/PlayersPanel';
import { DebugPanel } from './components/DebugPanel';
import OverlayEndGame from './components/OverlayEndGame';
import { useMe } from './hooks/useMe';
import OverlayTuto from './components/OverlayTuto';
import { useState } from 'react';
import { useTutorialStateMachine, TutorialSteps } from './hooks/useTutorialStateMachine';

function App() {
  // const { id } = useParams<{ id?: string }>();

  const { game_state } = useElementStore((state) => state);
  const [isTuto, setIsTuto] = useState(true);

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

  const gameState = 'STATE_1'; // Vous devez définir votre état de jeu ici

  const { currentStep, nextStep, resetTutorial } = useTutorialStateMachine(gameState);

  const handleCloseTuto = () => {
    setIsTuto(false);
  };

  const handleClickTuto = () => {
    setIsTuto(true);
  };

  const handleNextStep = () => {
    nextStep(); // Advance to the next step of the tutorial
  };

  return (
    <>
      <Toaster />
      {isItMyTurn && isTuto && (
        <>
          {currentStep === TutorialSteps.STEP_1 && (
            // Affichez le tutoriel correspondant à l'étape 1
            <OverlayTuto
              texts={['Here, you can view your opponents, the tiles they control, their cards, and their army size.']}
              onClose={handleCloseTuto}
              top={70}
              left={73}
              width={27}
              height={40}
              radius={7}
              handleNextStep={handleNextStep}
            />
          )}
          {currentStep === TutorialSteps.STEP_2 && (
            // Affichez le tutoriel correspondant à l'étape 2
            <OverlayTuto
              texts={[
                'The initial phase is the supply phase, during which you must distribute all your cards to the tiles you control according to your chosen strategy.',
              ]}
              onClose={handleCloseTuto}
              top={40}
              left={30}
              width={15}
              height={20}
              radius={50}
              handleNextStep={handleNextStep}
            />
          )}
          {currentStep === TutorialSteps.STEP_3 && (
            <OverlayTuto
              texts={['Once all troops have been deployed, proceed to the next phase.']}
              onClose={handleCloseTuto}
              top={91}
              left={56}
              width={5}
              height={7}
              radius={50}
              handleNextStep={handleNextStep}
            />
          )}
          {currentStep === TutorialSteps.STEP_4 && (
            <OverlayTuto
              texts={[
                'The second phase is the attack phase. Click on one of your tiles and an adjacent enemy tile to open the attack planning panel.',
              ]}
              onClose={handleCloseTuto}
              top={40}
              left={30}
              width={15}
              height={20}
              radius={50}
              handleNextStep={handleNextStep}
            />
          )}
          {currentStep === TutorialSteps.STEP_5 && (
            <OverlayTuto
              texts={['In the final phase, you can strategically reposition your troops between your owned tiles.']}
              onClose={handleCloseTuto}
              top={40}
              left={30}
              width={15}
              height={20}
              radius={50}
              handleNextStep={handleNextStep}
            />
          )}
          {currentStep === TutorialSteps.STEP_6 && (
            <OverlayTuto
              texts={["If you control an entire region, you'll receive additional troop reinforcements every turn."]}
              onClose={handleCloseTuto}
              top={2}
              left={74.5}
              width={5}
              height={7}
              radius={50}
              handleNextStep={handleNextStep}
            />
          )}
          {currentStep === TutorialSteps.STEP_7 && (
            <OverlayTuto
              texts={[
                'This is the log window, where you can track game events. Hover over underlined text for additional details.',
              ]}
              onClose={handleCloseTuto}
              top={80}
              left={0}
              width={27}
              height={40}
              radius={7}
              handleNextStep={handleNextStep}
            />
          )}
          {currentStep === TutorialSteps.STEP_8 && (
            <OverlayTuto
              texts={[
                'Each turn, conquering a territory earns you a card. Combine three cards for extra troops just before the deployment phase. You need to use them when you have five cards.',
              ]}
              onClose={handleCloseTuto}
              top={89}
              left={36.5}
              width={5}
              height={10}
              radius={40}
              handleNextStep={handleNextStep}
            />
          )}
        </>
      )}
      <div className="fixed top-0 left-0 z-[1000]">
        <DebugPanel />
      </div>
      {game_state === GameState.MainMenu && <MainMenu />}
      {game_state === GameState.Lobby && <Lobby />}
      {game_state === GameState.Game && (
        <>
          <div className="flex">
            <div className="w-full">
              <Map handleClickTuto={handleClickTuto} />
            </div>
          </div>
          <div className="fixed bottom-0 left-0 w-1/4 p-1">
            <ActionLogs />
          </div>
          <div className="fixed bottom-0 right-0 w-1/4 pb-1 pr-1">
            <PlayersPanel players={players} />
          </div>
          <div className="flex justify-center">
            <PlayPanel />
          </div>
        </>
      )}
      {me && me.rank !== 0 && <OverlayEndGame me={me} players={players} />}
    </>
  );
}

export default App;
