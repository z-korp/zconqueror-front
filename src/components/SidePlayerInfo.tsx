import { colorClasses, colorPlayer } from '@/utils/colors';
import { getComponentValue, getEntitiesWithValue } from '@dojoengine/recs';
import { avatars } from '../utils/pfps';
import { MountainSnow, RectangleVertical, Swords } from 'lucide-react';
import { useDojo } from '@/dojo/useDojo';
import { useGame } from '@/hooks/useGame';
import { shortAddress } from '@/utils/sanitizer';

interface SidePlayerInfoProps {
  index: number;
  player: any;
}

const SidePlayerInfo: React.FC<SidePlayerInfoProps> = ({ index, player }) => {
  const {
    setup: {
      clientComponents: { Tile },
    },
  } = useDojo();

  const game = useGame();

  if (player === undefined || game === undefined) return null;

  const color = colorPlayer[index + 1];
  const image = avatars[index + 1];
  const { name, address, cards } = player;

  const tiles = getEntitiesWithValue(Tile, { owner: index, game_id: game.id });
  const territories = [...tiles].length;
  const troops = [...tiles]
    .map((e) => getComponentValue(Tile, e))
    .map((obj) => obj.army)
    .reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="divide-y divide-stone-500 text-black">
      <div className="py-2 px-4">
        <div className="flex items-center">
          {/* Player Image */}
          <div className="w-14 h-14 flex-none">
            <img src={image} alt="player" className="rounded-full object-cover w-full h-full" />
          </div>
          {/* Player Name, Address, and Icons */}
          <div className="flex flex-col justify-center ml-4 text-left w-full">
            {/* Player Name and Address */}
            <div className="text-white text-sm flex justify-between">
              <div className="truncate">{name}</div>
              <div className="truncate opacity-50">{shortAddress(address)}</div> {/* Displaying the address */}
            </div>
            {/* Icons and Info */}
            <div className="flex gap-1 mt-2">
              <div className="flex gap-1">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePlayerInfo;
