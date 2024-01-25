import { useDojo } from '@/DojoContext';
import { colorClasses, colorPlayer } from '@/utils/colors';
import { useComponentValue } from '@dojoengine/react';
import { EntityIndex, getComponentValue, getEntitiesWithValue } from '@latticexyz/recs';
import { GiFrance, GiSwordsEmblem } from 'react-icons/gi';
import { avatars } from '../utils/pfps';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { unpackU128toNumberArray } from '@/utils/unpack';

interface SidePlayerInfoProps {
  index: number;
  entityId: EntityIndex;
}

const SidePlayerInfo: React.FC<SidePlayerInfoProps> = ({ index, entityId }) => {
  const {
    setup: {
      clientComponents: { Player, Tile },
    },
  } = useDojo();

  const player = useComponentValue(Player, entityId);
  if (player === undefined) return null;

  const tiles = getEntitiesWithValue(Tile, { owner: index });

  const { name: rawName, cards } = player;
  const name = Number(rawName) < 10 ? `Bot_${rawName}` : `${rawName}`;
  const color = colorPlayer[index + 1];
  0;
  const image = avatars[index + 1];
  const territories = [...tiles].length;
  const troops = [...tiles]
    .map((e) => getComponentValue(Tile, e))
    .map((obj) => obj.army)
    .reduce((acc, curr) => acc + curr, 0);

  const cardsArray = unpackU128toNumberArray(cards).filter((e: any) => e !== 0);

  return (
    <div
      className={`relative inline-flex h-[100px] w-[250px] rounded-l-full drop-shadow-[0_6.2px_8.2px_rgba(0,0,0,0.8)]`}
    >
      <div
        className={`flex flex-col justify-center w-2/3 h-full pl-6 bg-black bg-opacity-75 rounded-l-full border-4 border-${colorClasses[color]}`}
      >
        <Tooltip>
          <TooltipTrigger>
            <div className="flex gap-2 items-center text-white text-2xl">
              <GiSwordsEmblem />
              <p className="font-space-mono w-5">{troops}</p>
            </div>
          </TooltipTrigger>
          <TooltipContent>Troops</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex gap-2 items-center text-white text-2xl">
              <GiFrance />
              <p className="font-space-mono w-5">{territories}</p>
            </div>
          </TooltipTrigger>
          <TooltipContent>Territories</TooltipContent>
        </Tooltip>
      </div>
      <div className={` w-1/3 h-full ${colorClasses[color]}`}></div>
      <div className="absolute h-[110px] w-[110px] left-[100px] -top-[5px] rounded-full bg-red-400 z-10">
        <img src={image} alt={'player'} className="rounded-full" />
        <div className="absolute top-1 left-0 border border-slate-700 transform -translate-y-1/2 -rotate-12 bg-white text-black px-2 py-1 rounded">
          {cardsArray ? cardsArray.length : 0}
        </div>
      </div>
      <div
        className={`absolute w-[150px] h-[30px] bg-black -bottom-[25px] left-[75px] rounded-md ${colorClasses[color]} z-10 border-2 border-${colorClasses[color]}`}
      >
        <span className="uppercase text-white font-bold drop-shadow-[0_6.2px_8.2px_rgba(0,0,0,0.8)] text-sm">
          {name}
        </span>
      </div>
    </div>
  );
};

export default SidePlayerInfo;
