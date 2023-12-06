import { useDojo } from '@/DojoContext';
import { useComponentStates } from '@/hooks/useComponentState';
import { color100, colorClasses, colorPlayer } from '@/utils/colors';
import { useComponentValue } from '@dojoengine/react';
import { EntityIndex } from '@latticexyz/recs';
import { GiAxeSword, GiBattleGear, GiCrenulatedShield } from 'react-icons/gi';
import { avatars } from '../utils/pfps';
import { Phase, useElementStore } from '../utils/store';
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
      systemCalls: { finish },
    },
    account: { account },
  } = useDojo();
  const { current_address } = useElementStore((state) => state);

  const { current_state, set_current_state } = useElementStore((state) => state);

  const { turn } = useComponentStates();
  const player = useComponentValue(Player, entityId);

  if (player === undefined) return null;
  if (index !== turn) return null;

  const { name: rawName, supply } = player;
  const name = Number(rawName) < 10 ? `Bot_${rawName}` : `${rawName}`;
  const color = colorPlayer[index + 1];
  const image = avatars[index + 1];

  const textFromState = (state: number) => {
    if (state === 1) {
      return 'Deploying';
    } else if (state === 2) {
      return 'Attacking';
    } else if (state === 3) {
      return 'Fortifying';
    }
  };

  const handleNextPhaseClick = () => {
    if (!current_address) return;
    if (current_state < 3) {
      finish(account, current_address);
      set_current_state(current_state + 1);
    } else {
      finish(account, current_address);
      set_current_state(Phase.DEPLOY);
    }
  };

  const buttonText = current_state === Phase.FORTIFY ? 'End turn' : 'Next Phase';

  return (
    <Card className={`flex flex-row items-center p-4 mt-4 gap-6 ${color100[color]}`}>
      <div className="flex flex-col">
        <Card className={`w-20 h-20 rounded-full border flex items-center justify-center ${colorClasses[color]}`}>
          <img src={image} alt={'player'} className="rounded-full" />
        </Card>
        <div>{name}</div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center space-y-4  ">
        {/* Three bars & text */}
        <div className="text-center">
          <div className="mb-2">{textFromState(current_state)}</div>
          <div className="flex flex-row">
            <div
              className={`h-2 w-16 rounded-full ${
                current_state === Phase.DEPLOY ? colorClasses[color] : 'bg-gray-500'
              }`}
            ></div>
            <div
              className={`h-2 w-16 mx-2 rounded-full ${
                current_state === Phase.ATTACK ? colorClasses[color] : 'bg-gray-500'
              }`}
            ></div>
            <div
              className={`h-2 w-16 rounded-full ${
                current_state === Phase.FORTIFY ? colorClasses[color] : 'bg-gray-500'
              }`}
            ></div>
          </div>
        </div>

        {/* Next phase button */}

        <Button
          className={'bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600'}
          disabled={supply !== 0}
          onClick={handleNextPhaseClick}
        >
          {buttonText}
        </Button>
      </div>

      <Card
        className={`w-20 h-20 rounded-full border border-gray-300 flex items-center justify-center text-2xl font-bold ${colorClasses[color]}`}
      >
        {current_state === Phase.DEPLOY && (
          <div className="flex flex-row gap-1 items-center">
            <p className="font-space-mono">{supply}</p>
            <GiBattleGear />
          </div>
        )}
        {current_state === Phase.ATTACK && <GiAxeSword className="w-10 h-10" />}
        {current_state === Phase.FORTIFY && <GiCrenulatedShield className="w-10 h-10" />}
      </Card>
    </Card>
  );
};

export default PlayPanel;
