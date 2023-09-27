import { useComponentValue } from '@dojoengine/react';
import { EntityIndex, setComponent } from '@latticexyz/recs';
import { useEffect } from 'react';
import './App.css';
import { useDojo } from './DojoContext';
import NewGame from './components/NewGame';
import Map from './components/map/map';
import PlayPanel from './components/playPanel';
import { Moves, Position } from './generated/graphql';
import { getFirstComponentByType } from './utils';

function App() {
  const {
    setup: {
      systemCalls: {},
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

  useEffect(() => {
    if (!entityId) return;

    const fetchData = async () => {
      const { data } = await graphSdk.getEntities();

      if (data) {
        let remaining = getFirstComponentByType(
          data.entities?.edges,
          'Moves'
        ) as Moves;
        let position = getFirstComponentByType(
          data.entities?.edges,
          'Position'
        ) as Position;

        setComponent(Moves, parseInt(entityId.toString()) as EntityIndex, {
          remaining: remaining.remaining,
        });
        setComponent(Position, parseInt(entityId.toString()) as EntityIndex, {
          x: position.x,
          y: position.y,
        });
      }
    };

    fetchData();
  }, [account.address]);

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
