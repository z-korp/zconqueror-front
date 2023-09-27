import { useComponentValue } from '@dojoengine/react';
import { EntityIndex } from '@latticexyz/recs';
import './App.css';
import { useDojo } from './DojoContext';
import NewGame from './components/NewGame';
import Map from './components/map/map';
import PlayPanel from './components/playPanel';

function App() {
  const {
    setup: {
      components: { Moves, Position },
      network: { graphSdk },
    },
    account: { create, list, select, account, isDeploying },
  } = useDojo();

  // entity id - this example uses the account address as the entity id
  const entityId = account.address;

  // get current component values
  const position = useComponentValue(
    Position,
    parseInt(entityId.toString()) as EntityIndex
  );
  const moves = useComponentValue(
    Moves,
    parseInt(entityId.toString()) as EntityIndex
  );

  const handleRegionClick = (region: string) => {
    alert(`Vous avez cliqué sur la ${region}`);
  };

  return (
    <>
      <NewGame />
      <Map handleRegionClick={handleRegionClick} />
      <div className="flex justify-center">
        <PlayPanel currentStateProp={1} />
      </div>
    </>
  );
}

export default App;
