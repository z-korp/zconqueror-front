import './App.css';
import { useDojo } from './DojoContext';
import { useComponentValue } from "@dojoengine/react";
import { Direction } from './dojo/createSystemCalls'
import { EntityIndex } from '@latticexyz/recs';

function App() {
  const {
    systemCalls: { spawn, move },
    components: { Moves, Position },
  } = useDojo();

  const entityId = BigInt('0x3ee9e18edc71a6df30ac3aca2e0b02a198fbce19b7480a63a0d71cbd76652e0');

  const position = useComponentValue(Position, parseInt(entityId.toString()) as EntityIndex);

  const moves = useComponentValue(Moves, parseInt(entityId.toString()) as EntityIndex);

  return (
    <>
      <div className="card">
        <button onClick={() => spawn()}>Spawn</button>
      </div>
      <div className="card">
        {/* 3 == move up */}
        <button onClick={() => move(Direction.Up)}>Move Up</button>
        {/* 0 == move down */}
        <button onClick={() => move(Direction.Down)}>Move Down</button>

        {/* 1 == move left */}
        <button onClick={() => move(Direction.Left)}>Move Left</button>
        {/* 2 == move right */}
        <button onClick={() => move(Direction.Right)}>Move Right</button>

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
