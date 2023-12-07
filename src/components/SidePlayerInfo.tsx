import { useDojo } from '@/DojoContext';
import { colorClasses, colorPlayer } from '@/utils/colors';
import { useComponentValue } from '@dojoengine/react';
import { EntityIndex, getComponentValue, getEntitiesWithValue } from '@latticexyz/recs';
import { GiFrance, GiSwordsEmblem } from 'react-icons/gi';
import { avatars } from '../utils/pfps';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface SidePlayerInfoProps {
  index: number;
  entityId: EntityIndex;
}

const SidePlayerInfo: React.FC<SidePlayerInfoProps> = ({ index, entityId }) => {
  const {
    setup: {
      components: { Player, Tile },
    },
  } = useDojo();

  const player = useComponentValue(Player, entityId);
  if (player === undefined) return null;

  const tiles = getEntitiesWithValue(Tile, { owner: index });

  const { name: rawName, cards } = player;
  const name = Number(rawName) < 10 ? `Bot_${rawName}` : `${rawName}`;
  const color = colorPlayer[index + 1];
  const image = avatars[index + 1];
  const territories = [...tiles].length;
  const troops = [...tiles]
    .map((e) => getComponentValue(Tile, e))
    .map((obj) => obj.army)
    .reduce((acc, curr) => acc + curr, 0);

  return (
    <div
      className={`relative flex flex-col items-center border ${colorClasses[color]} rounded-l-lg box-shadow-md  justify-evenly px-2 py-1`}
    >
      <div className="flex items-center">
        <div className="flex flex-col items-end mx-1 mr-2">
          <Tooltip>
            <TooltipTrigger>
              <div className="flex gap-2 items-center ">
                <GiSwordsEmblem />
                <p className="font-space-mono w-5">{troops}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>Troops</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <div className="flex gap-2 items-center ">
                <GiFrance /> <p className="font-space-mono w-5">{territories}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>Territories</TooltipContent>
          </Tooltip>
        </div>
        <div>
          <img className="w-20 h-20" src={image} alt={color} />
          <div className="self-end">{name}</div>
        </div>
      </div>

      <div className="absolute top-1 left-0 border border-slate-700 transform -translate-y-1/2 -rotate-12 bg-white text-black px-2 py-1 rounded">
        {cards ? cards : 0}
      </div>
    </div>
  );
};

export default SidePlayerInfo;
