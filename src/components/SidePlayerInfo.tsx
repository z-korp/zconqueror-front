import { useDojo } from '@/DojoContext';
import { colorClasses, colorPlayer } from '@/utils/colors';
import { useElementStore } from '@/utils/store';
import { isTest } from '@/utils/test';
import { getComponentValue, getEntitiesWithValue } from '@latticexyz/recs';
import { useState } from 'react';
import { GiFrance, GiSwordsEmblem } from 'react-icons/gi';
import { undefined } from 'zod';
import { avatars } from '../utils/pfps';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { MountainSnow, RectangleVertical, Swords } from 'lucide-react';

interface SidePlayerInfoProps {
  index: number;
  player: any;
}

const SidePlayerInfo: React.FC<SidePlayerInfoProps> = ({ index, player }) => {
  const [showOtherElements, setShowOtherElements] = useState<boolean | null>(true);
  const {
    setup: {
      clientComponents: { Tile },
    },
  } = useDojo();

  const { game } = useElementStore((state) => state);

  if (player === undefined || game === undefined) return null;

  const cards = player.cards;
  const color = colorPlayer[index + 1];
  const image = avatars[index + 1];
  const address = player.address;

  const tiles = getEntitiesWithValue(Tile, { owner: index, game_id: game.id });
  const territories = [...tiles].length;
  const troops = [...tiles]
    .map((e) => getComponentValue(Tile, e))
    .map((obj) => obj.army)
    .reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="divide-y divide-stone-500 text-black">
      {/* Repeat this block for each player */}
      <div className="flex items-center py-2 px-4">
        <div className="w-12 h-12">
          <img src={image} alt={'player'} className="rounded-full" />
        </div>
        <div className="flex-grow">
          <div className="text-white text-sm truncate">{`${address.substring(0, 2)}...${address.substring(
            address.length - 3
          )}`}</div>
        </div>
        <div className="flex gap-1">
          {/* Replace with actual icons */}
          <button className={`${colorClasses[color]} rounded px-2 py-1 flex items-center`}>
            <span className="icon mr-1">
              <RectangleVertical size={18} />
            </span>
            <span>{cards ? cards.length : 0}</span>
          </button>
          <button className={`${colorClasses[color]} rounded px-2 py-1 flex items-center`}>
            <span className="icon mr-1">
              <Swords size={18} />
            </span>
            <span>{troops}</span>
          </button>
          <button className={`${colorClasses[color]} rounded px-2 py-1 flex items-center`}>
            <span className="icon mr-1">
              <MountainSnow size={18} />
            </span>
            <span>{territories} </span>
          </button>
        </div>
      </div>
      {/* End of player block */}
    </div>
  );
};

export default SidePlayerInfo;
