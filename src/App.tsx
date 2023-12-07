import { useEffect } from 'react';
import './App.css';
import NewGame from './components/NewGame';
import PlayPanel from './components/PlayPanel';
import SidePlayerInfo from './components/SidePlayerInfo';
import FortifyPanel from './components/map/FortifyPanel';
import Map from './components/map/Map';
import { TooltipProvider } from './components/ui/tooltip';
import { useComponentStates } from './hooks/useComponentState';
import { Phase, useElementStore } from './utils/store';
import Burner from './components/Burner';
import { useDojo } from './DojoContext';

function App() {
  const { set_ip } = useElementStore((state) => state);
  const {
    setup: {
      components: { Player },
      systemCalls: { finish },
    },
    account: { account },
  } = useDojo();
  const { playerIds, players, game } = useComponentStates();

  const { current_state } = useElementStore((state) => state);

  const isFortifyPanelVisible =
    current_state === Phase.FORTIFY || current_state === Phase.ATTACK || current_state === Phase.DEPLOY;
  return (
    <TooltipProvider>
      <NewGame />
      <Burner />
      <div className="flex">
        <div className="w-1/6 mr-4">{isFortifyPanelVisible && <FortifyPanel />}</div>
        <div className="w-5/6 pr-8">
          <Map />
        </div>
      </div>
      <div className="absolute top-24 right-0 flex gap-6 flex-col">
        {playerIds.map((entityId, index) => (
          <SidePlayerInfo key={index} index={index} entityId={entityId} />
        ))}
      </div>
      <div className="flex justify-center">
        {playerIds.map((entityId, index) => (
          <PlayPanel key={index} index={index} entityId={entityId} />
        ))}
      </div>
    </TooltipProvider>
  );
}

export default App;
