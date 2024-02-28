import { useGetTiles } from '@/hooks/useGetTiles';
import GameCard from './GameCard';
import { Button } from './ui/button';
import { useMe } from '@/hooks/useMe';
import continentsData from '../assets/map/continents.json';
import { useElementStore } from '@/utils/store';
import { useEffect, useState } from 'react';
import { CardType } from '@/utils/cards';

interface EndTurnPopupProps {
  cards: CardType[];
  onClose: () => void;
}

const EndTurnPopup: React.FC<EndTurnPopupProps> = ({ cards, onClose }) => {
  const { tiles } = useGetTiles();
  const { me } = useMe();
  const { tilesConqueredThisTurn } = useElementStore((state) => state);
  const [continentNames, setContinentNames] = useState<string[]>([]);
  useEffect(() => {
    const playerTilesSet = new Set(tiles.filter((t) => t.owner === (me?.index ?? null)).map((t) => t.id));
    const conqueredThisTurnSet = new Set(tilesConqueredThisTurn);

    const continentsToHighlight = continentsData.continents
      .filter((continent) => continent.regions.every((region) => playerTilesSet.has(region)))
      .filter((continent) => continent.regions.some((region) => conqueredThisTurnSet.has(region)))
      .map((continent) => continent.id);

    setContinentNames(
      continentsToHighlight.map((continentId) => {
        const continent = continentsData.continents.find((c) => c.id === continentId);
        return continent ? continent.name : '';
      })
    );
  }, [tiles, tilesConqueredThisTurn, me?.index]);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 vt323-font text-2xl text-white">
      <div className="relative bg-stone-700 border-2 border-stone-900 p-6 rounded-lg shadow-lg text-center pointer-events-auto">
        <Button
          onClick={onClose}
          className="absolute top-2 right-2 flex items-center justify-center p-1 w-[22px] h-[22px] bg-red-500 text-white rounded-full text-xs"
        >
          ✕
        </Button>

        <div className="max-w-md text-white mb-4">
          <p className="text-2xl">Congratulations!</p>
          <p className="text-lg">
            Your successful conquests have earned you this card. Use it wisely to fortify your dominion.
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          {cards.length > 0 && <GameCard card={cards[cards.length - 1]} />}
        </div>
        {continentNames.length > 0 && (
          <div className="text-lg mt-4">
            <p>You have conquered the following continent{continentNames.length > 1 ? 's' : ''}:</p>
            {continentNames.map((continentName) => (
              <p key={continentName}>{continentName}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EndTurnPopup;
