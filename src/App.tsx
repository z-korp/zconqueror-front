import './App.css';
import { useDojo } from './DojoContext';
import NewGame from './components/NewGame';
import Map from './components/map/map';
import PlayPanel from './components/playPanel';
import { Button } from './components/ui/button';

function App() {
  const {
    setup: {
      systemCalls: { create },
      network: { graphSdk },
    },
    account: { account },
  } = useDojo();

  const handleRegionClick = (region: string) => {
    alert(`Vous avez cliqué sur la ${region}`);
  };

  return (
    <>
      <NewGame />
      <Button onClick={() => create(account, 'test', 112223, 'testname', 4)}>
        Create
      </Button>
      <Map handleRegionClick={handleRegionClick} />
      <div className="flex justify-center">
        <PlayPanel currentStateProp={1} />
      </div>
    </>
  );
}

export default App;
