import { useDojo } from '@/DojoContext';
import { useComponentStates } from '@/hooks/useComponentState';
import { colorClasses, colorPlayer } from '@/utils/colors';
import { useComponentValue } from '@dojoengine/react';
import { EntityIndex } from '@latticexyz/recs';
import { GiBattleGear } from 'react-icons/gi';
import { FaChevronRight } from 'react-icons/fa6';
import { avatars } from '../utils/pfps';
import { Phase, useElementStore } from '../utils/store';
import { useEffect, useState } from 'react';
import { unpackU128toNumberArray } from '@/utils/unpack';
import { Card, CardTitle } from './ui/card';

interface PlayPanelProps {
  index: number;
  entityId: EntityIndex;
}

const PlayPanel = ({ index, entityId }: PlayPanelProps) => {
  const {
    setup: {
      clientComponents: { Player },
      client: { play },
    },
    account: { account },
  } = useDojo();

  const { current_address, game_id } = useElementStore((state) => state);

  const { current_state, set_current_state } = useElementStore((state) => state);

  const { turn } = useComponentStates();
  const player = useComponentValue(Player, entityId);
  const [cards, setCards] = useState<number[]>([]);
  const [conqueredThisTurn, setConqueredThisTurn] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(player);
  const [currentTurn, setCurrentTurn] = useState(turn);
  useEffect(() => {
    if (player?.conqueror === 1) {
      console.log('YOU ARE THE CONQUEROR');
      setConqueredThisTurn(true);
    }
  }, [player?.conqueror]);

  useEffect(() => {
    console.log('current Player card:', currentPlayer?.cards);
    console.log('player cards:', player?.cards);
    if (conqueredThisTurn) {
      setCards(unpackU128toNumberArray(player.cards).filter((e: number) => e !== 0));
      console.log('CARDS:', cards);
      console.log('CARDS ARRAY:', unpackU128toNumberArray(currentPlayer.cards));
      setShowCardsPopup(true);
      setConqueredThisTurn(false);
    }

    const timer = setTimeout(() => {
      setCurrentTurn(turn);
      setCurrentPlayer(player);
    }, 4000);

    return () => clearTimeout(timer);
  }, [turn]);

  const [showCardsPopup, setShowCardsPopup] = useState(false);

  useEffect(() => {
    let timer: any;
    if (showCardsPopup) {
      timer = setTimeout(() => {
        setShowCardsPopup(false);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [showCardsPopup]);

  if (player === undefined) return null;
  if (index !== currentTurn) return null;

  const { name: rawName } = currentPlayer;
  const { supply } = player;
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
    if (!game_id) return;
    if (current_state < 3) {
      play.finish(account, game_id);
      set_current_state(current_state + 1);
    } else {
      play.finish(account, game_id);

      set_current_state(Phase.DEPLOY);
    }
  };

  const closePopup = () => {
    setShowCardsPopup(false);
  };

  return (
    <>
      {showCardsPopup && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50">
          <div className="p-8 bg-white rounded shadow-lg text-center">
            <p>Votre message ici</p>
            <h2>Cartes</h2>
            <Card>
              {/* Contenu de la carte */}
              <p>Ceci est le contenu de ma carte</p>

              {/* Ajouter d'autres éléments comme titre, image, etc */}
              <CardTitle>Titre de la carte</CardTitle>
              <img src="image.png" />
            </Card>
            <ul>{cards && cards.map((card, index) => <li key={index}> Test: {card}</li>)}</ul>
            <button onClick={closePopup}>Fermer</button>
          </div>
        </div>
      )}
      <div className="h-[100px] max-w-[400px] rounded-md w-full bg-black bg-opacity-30 backdrop-blur-md">
        <div className="relative w-full h-full">
          <div className="absolute h-[120px] w-[120px] rounded-full bg-red-400 -left-[25px] -top-[25px] z-10">
            <img src={image} alt={'player'} className="rounded-full" />
          </div>

          <div className="flex flex-row justify-center mt-1">
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
          <div className="flex h-[60px] items-center justify-center">
            <span className="text-white text-2xl uppercase font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
              {textFromState(current_state)}
            </span>
          </div>
          <div
            className={`absolute flex justify-center h-[120px] w-[120px] rounded-full -right-[25px] -top-[25px] z-10 bg-red-500 border-8 border-red-600`}
          >
            {current_state === Phase.DEPLOY && supply > 0 && (
              <div className="flex flex-row gap-1 items-center text-4xl text-white drop-shadow-[0_6.2px_8.2px_rgba(0,0,0,0.8)]">
                <p className="font-space-mono">{supply}</p>
                <GiBattleGear />
              </div>
            )}

            {supply === 0 && (
              <button
                className="absolute top-1 flex justify-center items-center w-[80px] h-[80px] rounded-full active:translate-y-2  active:[box-shadow:0_0px_0_0_#15803d]
							active:border-b-[0px]
							transition-all duration-150 [box-shadow:0_8px_0_0_#15803d]
							border-[1px] border-green-700 bg-green-600"
                onClick={handleNextPhaseClick}
              >
                {current_state === Phase.FORTIFY ? (
                  <span className="text-white text-md uppercase font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                    End Turn
                  </span>
                ) : (
                  <FaChevronRight className="h-[50px] w-[50px] text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]" />
                )}
              </button>
            )}
          </div>

          <div
            className={`absolute flex justify-center items-center h-[50px] w-[426px] -left-[13px] -bottom-[25px] rounded-md drop-shadow-[0_6.2px_8.2px_rgba(0,0,0,0.8)]  ${colorClasses[color]}`}
          >
            <span className="text-white uppercase font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">{name}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayPanel;
