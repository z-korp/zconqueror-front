import { useDojo } from '@/DojoContext';
import { useComponentStates } from '@/hooks/useComponentState';
import { color100, colorClasses, colorPlayer } from '@/utils/colors';
import { useComponentValue } from '@dojoengine/react';
import { EntityIndex } from '@latticexyz/recs';
import { useState } from 'react';
import { avatars } from '../utils/pfps';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface PlayPanelProps {
  index: number;
  entityId: EntityIndex;
}

const PlayPanel = ({ index, entityId }: PlayPanelProps) => {
  const {
    setup: {
      components: { Player },
    },
  } = useDojo();

  const [currentState, setCurrentState] = useState(1);

  const { turn } = useComponentStates();
  const player = useComponentValue(Player, entityId);
  if (player === undefined) return null;
  if (index !== turn) return null;

  const { name: rawName, supply } = player;
  const name = Number(rawName) < 10 ? `Bot_${rawName}` : `${rawName}`;
  const color = colorPlayer[index + 1];
  const image = avatars[index + 1];

  let phaseText = '';
  if (currentState === 1) {
    phaseText = 'Deploying';
  } else if (currentState === 2) {
    phaseText = 'Attacking';
  } else if (currentState === 3) {
    phaseText = 'Fortifying';
  }

  const handleNextPhaseClick = () => {
    if (currentState < 3) {
      setCurrentState(currentState + 1);
    } else {
      setCurrentState(1);
    }
  };

  const buttonText = currentState === 3 ? 'End turn' : 'Next Phase';

  return (
    <Card
      className={`flex flex-row items-center p-4 mt-4 gap-6 ${color100[color]}`}
    >
      <div className="flex flex-col">
        <Card
          className={`w-20 h-20 rounded-full border border-gray-300 flex items-center justify-center ${colorClasses[color]}`}
        >
          <img src={image} alt={'player'} className="rounded-full" />
        </Card>
        <div>{name}</div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center space-y-4  ">
        {/* Three bars & text */}
        <div className="text-center">
          <div className="mb-2">{phaseText}</div>
          <div className="flex flex-row">
            <div
              className={`h-2 w-16 rounded-full ${
                currentState === 1 ? 'bg-red-500' : 'bg-gray-500'
              }`}
            ></div>
            <div
              className={`h-2 w-16 mx-2 rounded-full ${
                currentState === 2 ? 'bg-red-500' : 'bg-gray-500'
              }`}
            ></div>
            <div
              className={`h-2 w-16 rounded-full ${
                currentState === 3 ? 'bg-red-500' : 'bg-gray-500'
              }`}
            ></div>
          </div>
        </div>

        {/* Next phase button */}

        <Button
          className={
            'bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600'
          }
          disabled={supply !== 0}
          onClick={handleNextPhaseClick}
        >
          {buttonText}
        </Button>
      </div>

      <Card
        className={`w-20 h-20 rounded-full border border-gray-300 flex items-center justify-center text-2xl font-bold ${colorClasses[color]}`}
      >
        {supply}
      </Card>
    </Card>
  );
};

export default PlayPanel;
