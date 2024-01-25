import { useEffect, useState } from 'react';
import './App.css';
import NewGame from './components/NewGame';
import PlayPanel from './components/PlayPanel';
import SidePlayerInfo from './components/SidePlayerInfo';
import FortifyPanel from './components/map/FortifyPanel';
import Map from './components/map/Map';
import { TooltipProvider } from './components/ui/tooltip';
import { useComponentStates } from './hooks/useComponentState';
import { Phase, useElementStore } from './utils/store';
import { useDojo } from './DojoContext';
import { Has, defineSystem } from '@dojoengine/recs';

function App() {
  const {
    setup: {
      clientComponents: { Game },
      world,
    },
  } = useDojo();
  const { playerIds } = useComponentStates();

  const { current_state, set_game_id } = useElementStore((state) => state);

  const isFortifyPanelVisible =
    current_state === Phase.FORTIFY || current_state === Phase.ATTACK || current_state === Phase.DEPLOY;

  useEffect(() => {
    defineSystem(world, [Has(Game)], function ({ value: [newValue] }: any) {
      console.log(newValue);
      set_game_id(newValue.id);
    });
  }, []);

  return (
    <TooltipProvider>
      <NewGame />
      <div className="flex">
        <div className="w-1/6 mr-4">{isFortifyPanelVisible && <FortifyPanel />}</div>
        <div className="w-5/6 pr-8">
          <Map />
        </div>
      </div>
      <div className="absolute top-24 right-0 flex gap-14 flex-col">
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
