import { HasValue, defineSystem } from '@dojoengine/recs';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './App.css';
import { useDojo } from './DojoContext';
import ActionLogs from './components/ActionLogs';
import NewGame from './components/NewGame';
import PlayPanel from './components/PlayPanel';
import SidePlayerInfo from './components/SidePlayerInfo';
import Map from './components/map/Map';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';
import { useGetPlayers } from './hooks/useGetPlayers';
import { useElementStore } from './utils/store';

function App() {
  const {
    setup: {
      clientComponents: { Game },
      world,
    },
    account: { account },
  } = useDojo();

  const { id } = useParams<{ id?: string }>();

  const { set_game } = useElementStore((state) => state);

  useEffect(() => {
    console.log('URL ID:', id);
    if (id !== undefined) {
      // Get the game with the ID from the URL
      defineSystem(world, [HasValue(Game, { id: Number(id) })], ({ value: [newGame] }: any) => {
        console.log('newGame', newGame);
        set_game(newGame);
      });
    } else {
      // Get the game that the user is hosting, if any
      defineSystem(world, [HasValue(Game, { host: BigInt(account.address) })], ({ value: [newGame] }: any) => {
        console.log('newGame', newGame);
        set_game(newGame);
      });
    }
  }, [account]);

  const { players } = useGetPlayers();

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
          {players.map((player, index) => (
            <SidePlayerInfo key={index} index={index} player={player} />
          ))}
        </div>
      </TooltipProvider>
      <div className="flex justify-center">
        <PlayPanel />
      </div>
      <div className="fixed bottom-0 left-0 w-1/3">
        <ActionLogs />
      </div>
    </>
  );
}

export default App;
