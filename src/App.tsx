import { HasValue, defineSystem } from '@dojoengine/recs';
import { useEffect } from 'react';
import './App.css';
import { useDojo } from './DojoContext';
import ActionLogs from './components/ActionLogs';
import NewGame from './components/NewGame';
import PlayPanel from './components/PlayPanel';
import SidePlayerInfo from './components/SidePlayerInfo';
import Map from './components/map/Map';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';
import { useComponentStates } from './hooks/useComponentState';
import { useElementStore } from './utils/store';

function App() {
  const {
    setup: {
      clientComponents: { Game },
      world,
    },
    account: { account },
  } = useDojo();
  const { playerIds } = useComponentStates();

  const { set_game_id, set_game } = useElementStore((state) => state);

  useEffect(() => {
    defineSystem(world, [HasValue(Game, { host: BigInt(account.address) })], ({ value: [newGame] }: any) => {
      set_game_id(newGame.id);
      console.log(newGame);
      set_game(newGame);
    });
  }, [account]);

  return (
    <>
      <Toaster />
      <TooltipProvider>
        <NewGame />
        <div className="flex">
          <div className="w-full">
            <Map />
          </div>
        </div>
        <div className="absolute top-24 right-0 flex gap-14 flex-col">
          {playerIds.map((entityId, index) => (
            <SidePlayerInfo key={index} index={index} entityId={entityId} />
          ))}
        </div>
      </TooltipProvider>
      <div className="flex justify-center">
        {playerIds.map((entityId, index) => (
          <PlayPanel key={index} index={index} entityId={entityId} />
        ))}
      </div>
      <div className="fixed bottom-0 left-0 w-1/3">
        <ActionLogs />
      </div>
    </>
  );
}

export default App;
