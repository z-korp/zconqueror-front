import { useDojo } from '@/DojoContext';
import { colorPlayer } from '@/utils/colors';
import { useComponentValue } from '@dojoengine/react';
import { EntityIndex } from '@latticexyz/recs';
import persoImage from '../assets/perso.png';

interface SidePlayerInfoProps {
  index: number;
  entityId: EntityIndex;
}

const SidePlayerInfo: React.FC<SidePlayerInfoProps> = ({ index, entityId }) => {
  const {
    setup: {
      components: { Player },
    },
  } = useDojo();

  const player = useComponentValue(Player, entityId);
  if (player === undefined) return null;

  const { name: rawName, cards } = player;
  const name = Number(rawName) < 10 ? `Bot_${rawName}` : `${rawName}`;
  const color = colorPlayer[index + 1];
  const troops = 0;
  const territories = 0;
  const image = persoImage;

  return (
    <>
      <div
        className={`relative flex flex-row items-center bg-${color}-500 rounded-l-lg box-shadow-md mb-2 pl-3 py-3`}
      >
        <div className="flex flex-col items-end mr-1 flex-grow pr-3">
          <p className="text-right">{name}</p>
          <p>Troupes : {troops}</p>
          <p>Territoires : {territories}</p>
        </div>
        <img src={image} alt={color} />
        <div className="absolute top-3 transform -translate-y-1/2 -rotate-6 bg-white text-black px-2 py-1 rounded">
          {cards ? cards : 0}
        </div>
      </div>
    </>
  );
};

export default SidePlayerInfo;
