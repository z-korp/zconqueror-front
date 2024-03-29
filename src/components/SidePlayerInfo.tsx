import { colorClasses, colorPlayer } from '@/utils/colors';
import { getComponentValue, getEntitiesWithValue } from '@dojoengine/recs';
import { avatars } from '../utils/pfps';
import { MountainSnow, RectangleVertical, Swords } from 'lucide-react';
import { useDojo } from '@/dojo/useDojo';
import { useGame } from '@/hooks/useGame';
import { shortAddress } from '@/utils/sanitizer';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Player } from '@/utils/types';
import { useEmotes } from '@/hooks/useEmotes';
import { useEffect, useState } from 'react';
import emotes from '@/utils/emotes';

interface SidePlayerInfoProps {
  index: number;
  player: Player;
}

const SidePlayerInfo: React.FC<SidePlayerInfoProps> = ({ index, player }) => {
  const {
    setup: {
      clientComponents: { Tile },
    },
  } = useDojo();

  const game = useGame();
  const { emote } = useEmotes();
  const [showEmote, setShowEmote] = useState(false);
  const [currentEmote, setCurrentEmote] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Vérifier si l'emote reçu correspond au joueur actuel
    if (emote !== undefined && parseInt(emote[0]) === player.index) {
      setShowEmote(true);
      setCurrentEmote(emotes[parseInt(emote[1])]);
    }

    // Afficher l'emote pendant deux secondes
    setTimeout(() => {
      setShowEmote(false);
    }, 2000);
  }, [player.index, emote]);

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
    <div className="divide-y divide-stone-500 text-black vt323-font">
      <div className="py-2 px-4">
        <div className="flex items-center">
          {/* Player Image or emote */}
          <div className="w-14 h-14 flex-none">
            {showEmote ? (
              <div className="text-5xl shake">{currentEmote}</div>
            ) : (
              <img src={image} alt="player" className="rounded-full object-cover w-full h-full mt-1" />
            )}
          </div>
          {/* Player Name, Address, and Icons */}
          <div className="flex flex-col justify-center ml-4 text-left w-full">
            {/* Player Name and Address */}
            <div className="text-white text-md flex justify-between ">
              <div className="truncate">{name}</div>
              <div className="truncate opacity-50">{shortAddress(address)}</div> {/* Displaying the address */}
            </div>
            {/* Icons and Info */}
            <div className="flex gap-1 mt-1">
              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`${colorClasses[color]} rounded px-2 py-1 flex items-center w-14 cursor-pointer`}>
                      <span className="icon mr-1 -rotate-6">
                        <RectangleVertical size={18} />
                      </span>
                      <span>{cards ? cards.length : 0}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Cards</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`${colorClasses[color]} rounded px-2 py-1 flex items-center w-14 cursor-pointer`}>
                      <span className="icon mr-1">
                        <Swords size={18} />
                      </span>
                      <span>{troops}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Troups</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`${colorClasses[color]} rounded px-2 py-1 flex items-center w-14 cursor-pointer`}>
                      <span className="icon mr-1">
                        <MountainSnow size={18} />
                      </span>
                      <span>{territories} </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Territories</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePlayerInfo;
