import ActionLogs from './ActionLogs/ActionLogs';
import DynamicOverlayTuto from './DynamicOverlayTuto';
import PlayPanel from './PlayPanel';
import PlayersPanel from './PlayersPanel';
import Map from './map/Map';
import tutorialData from '@/data/tutorialSteps.json';
import { useGetPlayers } from '@/hooks/useGetPlayers';

const Game: React.FC = () => {
  const { players } = useGetPlayers();

  return (
    <>
      <div className="flex">
        <div className="w-full">
          <DynamicOverlayTuto tutorialStep="5" texts={tutorialData['5']}>
            <DynamicOverlayTuto tutorialStep="4" texts={tutorialData['4']}>
              <DynamicOverlayTuto tutorialStep="2" texts={tutorialData['2']}>
                <Map />
              </DynamicOverlayTuto>
            </DynamicOverlayTuto>
          </DynamicOverlayTuto>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-1/4 p-1">
        <DynamicOverlayTuto tutorialStep="7" texts={tutorialData['7']}>
          <ActionLogs />
        </DynamicOverlayTuto>
      </div>
      <div className="fixed bottom-0 right-0 w-1/4 pb-1 pr-1">
        <DynamicOverlayTuto tutorialStep="1" texts={tutorialData['1']}>
          <PlayersPanel players={players} />
        </DynamicOverlayTuto>
      </div>
      <div className="flex justify-center">
        <PlayPanel />
      </div>
    </>
  );
};

export default Game;
