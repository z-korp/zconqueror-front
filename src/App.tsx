import "./App.css";
import { useDojo } from "./DojoContext";
import { useComponentValue } from "@dojoengine/react";
import { Direction } from "./dojo/createSystemCalls";
import { EntityIndex, setComponent } from "@latticexyz/recs";
import { useEffect } from "react";
import { getFirstComponentByType } from "./utils";
import { Moves, Position } from "./generated/graphql";
import Map from "./components/map/map";
import { Button } from "./components/ui/button";
import PlayPanel from "./components/playPanel";
import NewGame from "./components/NewGame";

function App() {
  const {
    setup: {
      systemCalls: { spawn, move },
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
          "Moves"
        ) as Moves;
        let position = getFirstComponentByType(
          data.entities?.edges,
          "Position"
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
      <Button onClick={create}>
        {isDeploying ? "deploying burner" : "create burner"}
      </Button>
      <div className="card">
        select signer:{" "}
        <select onChange={(e) => select(e.target.value)}>
          {list().map((account, index) => {
            return (
              <option value={account.address} key={index}>
                {account.address}
              </option>
            );
          })}
        </select>
      </div>

      <div className="card">
        <Button onClick={() => spawn(account)}>Spawn</Button>
      </div>
      <NewGame />
      <Map handleRegionClick={handleRegionClick} />
      <div className="flex justify-center">
        <PlayPanel currentStateProp={1} />
      </div>
      <div className="card">
        <Button onClick={() => move(account, Direction.Up)}>Move Up</Button>
        <Button onClick={() => move(account, Direction.Down)}>Move Down</Button>
        <Button onClick={() => move(account, Direction.Left)}>Move Left</Button>
        <Button onClick={() => move(account, Direction.Right)}>
          Move Right
        </Button>
      </div>
      <div className="card">
        <div>
          Moves Left: {moves ? `${moves["remaining"]}` : "Need to Spawn"}
        </div>
      </div>
      <div className="card">
        <div>
          Position:{" "}
          {position ? `${position["x"]}, ${position["y"]}` : "Need to Spawn"}
        </div>
      </div>
    </>
  );
}

export default App;
