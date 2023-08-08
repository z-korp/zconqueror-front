import './App.css';
import { useDojo } from './DojoContext';
import { useComponentValue } from "@dojoengine/react";
import { Direction } from './dojo/createSystemCalls'
import { EntityIndex } from '@latticexyz/recs';

function App() {
  const {
    setup: { systemCalls: { spawn, move },
      components: { Moves, Position },
    },
    account: { create, list, select, account }
  } = useDojo();

  const entityId = BigInt('0x3ee9e18edc71a6df30ac3aca2e0b02a198fbce19b7480a63a0d71cbd76652e0');

  const position = useComponentValue(Position, parseInt(entityId.toString()) as EntityIndex);

  const moves = useComponentValue(Moves, parseInt(entityId.toString()) as EntityIndex);

  return (
    <>
      <div>
        <div className="card">
          Current Signer: {account?.address}
        </div>
      </div>
      <div className="card">
        <button onClick={create}>create burner</button>

        {list().map((account, index) => {
          return <button onClick={() => select(account.address)} key={index}>{account.address}</button>
        })}
      </div>

      <div className="card">
        <button onClick={() => spawn(account)}>Spawn</button>
      </div>
      <div className="card">
        <button onClick={() => move(account, Direction.Up)}>Move Up</button>
        <button onClick={() => move(account, Direction.Down)}>Move Down</button>
        <button onClick={() => move(account, Direction.Left)}>Move Left</button>
        <button onClick={() => move(account, Direction.Right)}>Move Right</button>
      </div>
      <div className="card">
        <div>Moves Left: {moves ? `${moves['remaining']}` : 'Need to Spawn'}</div>
      </div>
      <div className="card">
        <div>Position: {position ? `${position['x']}, ${position['y']}` : 'Need to Spawn'}</div>
      </div>
    </>
  );
}

export default App;
