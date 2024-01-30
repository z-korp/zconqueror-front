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
import { feltToStr, unpackU128toNumberArray } from '@/utils/unpack';
import GameCard from './GameCard';
import OverlayWithText from './OverlayWithText';

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

  const { current_address, game_id, game } = useElementStore((state) => state);

  const { current_state, set_current_state } = useElementStore((state) => state);

  const { turn } = useComponentStates();
  const player = useComponentValue(Player, entityId);
  const [cards, setCards] = useState<number[]>([]);
  const [pendingCards, setPendingCards] = useState<number[]>([]);
  const [conqueredThisTurn, setConqueredThisTurn] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(player);
  const [currentTurn, setCurrentTurn] = useState(turn);
  const [showCardsPopup, setShowCardsPopup] = useState(false);
  const [showCardMenu, setShowCardMenu] = useState(false);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayText, setOverlayText] = useState('');

  const textFromState = (state: number) => {
    if (state === 1) {
      return 'Deploying';
    } else if (state === 2) {
      return 'Attacking';
    } else if (state === 3) {
      return 'Fortifying';
    }
    return 'Unknown';
  };

  useEffect(() => {
    if (player?.conqueror === 1) {
      setConqueredThisTurn(true);
    }
  }, [player?.conqueror]);

  useEffect(() => {
    if (game_id != null) {
      if (conqueredThisTurn) {
        setCards(unpackU128toNumberArray(player.cards).filter((e: number) => e !== 0));
        setPendingCards(unpackU128toNumberArray(player.cards).filter((e: number) => e !== 0));
        setShowCardsPopup(true);
        setConqueredThisTurn(false);
      }

      const timer = setTimeout(() => {
        setCurrentTurn(turn);
        setCurrentPlayer(player);
      }, 4000);

      const timer2 = setTimeout(() => {
        let text = textFromState(1);
        setOverlayText(text);
        setShowOverlay(true);
      }, 4500);

      const timer3 = setTimeout(() => {
        setShowOverlay(false);
      }, 6000);

      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [turn]);

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
  if (currentPlayer === undefined) return null;

  const { supply } = player;

  const name = feltToStr(currentPlayer.name);
  const color = colorPlayer[index + 1];
  const image = avatars[index + 1];

  const handleNextPhaseClick = () => {
    if (game_id == null || game_id == undefined) return;
    let text = '';
    if (current_state < 3) {
      play.finish(account, game_id);
      text = textFromState(current_state + 1);
      set_current_state(current_state + 1);
      setOverlayText(text);
      setShowOverlay(true);
    } else {
      play.finish(account, game_id);
      set_current_state(Phase.DEPLOY);
    }

    const timer2 = setTimeout(() => {
      setShowOverlay(false);
    }, 2000);

    return () => clearTimeout(timer2);
  };

  const closePopup = () => {
    setShowCardsPopup(false);
  };

  const toggleCardMenu = () => {
    setShowCardMenu(!showCardMenu);
  };

  const discardCards = () => {
    console.log(selectedCards[0]);
    if (game_id !== undefined && game_id !== null) {
      play.discard(account, game_id, selectedCards[0], selectedCards[1], selectedCards[2]);
      setSelectedCards([]);
    }
  };

  const handleCardSelect = (cardNumber: number) => {
    if (selectedCards.includes(cardNumber)) {
      setSelectedCards(selectedCards.filter((c) => c !== cardNumber));
      setPendingCards([...pendingCards, cardNumber]);
    } else if (selectedCards.length < 3) {
      //logique pour ne pas selectionner une 3 eme carte qui empeche le discard
      if (selectedCards.length == 2) {
        const card1 = (selectedCards[0] % 3) + 1;
        const card2 = (selectedCards[1] % 3) + 1;
        const card3 = (cardNumber % 3) + 1;
        if (card1 == card2) {
          if (card1 != card3) return;
        } else {
          if (card1 == card3 || card2 == card3) return;
        }
      }
      setSelectedCards([...selectedCards, cardNumber]);
      setPendingCards(pendingCards.filter((c) => c !== cardNumber));
    }
  };

  return (
    <>
      <div className="fixed bottom-14 left-0 right-0 flex justify-center items-end p-4 pointer-events-none">
        {showOverlay && <OverlayWithText text={overlayText} />}
        {/* Section du panneau de jeu */}
        <div className="flex relative items-center">
          <div
            className="mx-10 pointer-events-auto"
            onClick={() => {
              console.log('Circle clicked');
              toggleCardMenu();
            }}
          >
            <button className="w-[58px] h-[75px] relative flex justify-center items-center bg-black bg-opacity-30 backdrop-blur-md rounded-lg border-2 border-primary drop-shadow-lg hover:transform hover:-translate-y-1 transition-transform ease-in-out ">
              <div className="w-7 h-9 absolute top-4 left-4 border border-slate-700 drop-shadow-lg transform -rotate-12 bg-white text-black px-2 py-1 rounded"></div>
              <div className="w-7 h-9 absolute top-5 left-3 border border-slate-700 drop-shadow-lg transform -rotate-12 bg-white text-black px-2 py-1 rounded">
                {cards.length}
              </div>
            </button>
          </div>
        </div>
        {/* Menu des cartes */}
        {showCardMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center pointer-events-auto h-2/3">
              {/* Cartes sélectionnées */}
              <div className="flex justify-center space-x-4 mb-4">
                {[1, 2, 3].map((index) =>
                  selectedCards.length >= index ? (
                    <div key={index} onClick={() => handleCardSelect(selectedCards[index - 1])}>
                      <GameCard cardNumber={selectedCards[index - 1]} />
                    </div>
                  ) : (
                    <div key={index} className="w-32 h-48 bg-gray-200 rounded-lg shadow-md"></div>
                  )
                )}
              </div>
              {/* Options de carte */}
              <div className="flex justify-center space-x-4">
                {cards.map((cardNumber, index) => (
                  <div key={index} onClick={() => handleCardSelect(cardNumber)}>
                    <GameCard cardNumber={cardNumber} />
                  </div>
                ))}
              </div>
              <button
                onClick={discardCards}
                className="w-32 py-2 m-4 text-white bg-blue-500 rounded hover:bg-blue-600"
                disabled={current_state !== Phase.DEPLOY || selectedCards.length !== 3}
              >
                Exchange
              </button>
              <button
                onClick={toggleCardMenu}
                className="w-32 py-2 m-4 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
            <button onClick={closePopup} className="mt-4">
              Close
            </button>
          </div>
        )}
        {/* Barre d'état du joueur */}
        <div className="h-[100px] max-w-[400px] rounded-md w-full bg-black bg-opacity-30 backdrop-blur-md">
          <div className="relative w-full h-full">
            {/* Image du joueur */}
            <div className="absolute h-[120px] w-[120px] rounded-full bg-red-400 -left-[25px] -top-[25px] z-10">
              <img src={image} alt={'player'} className="rounded-full" />
            </div>
            {/* Barre d'état */}
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
            {/* Texte d'état */}
            <div className="flex h-[60px] items-center justify-center">
              <span className="text-white text-2xl uppercase font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                {textFromState(current_state)}
              </span>
            </div>
            {/* Bouton "Next Phase" */}
            <div
              className={`absolute flex justify-center h-[120px] w-[120px] rounded-full -right-[25px] -top-[25px] z-10 bg-red-500 border-8 border-red-600 pointer-events-auto`}
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
                border-[1px] border-green-700 bg-green-600 hover:transform hover:-translate-y-1 transition-transform ease-in-out"
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
            {/* Card options */}
            <div className="flex justify-center space-x-4">
              {pendingCards.map((cardNumber, index) => (
                <div key={index} onClick={() => handleCardSelect(cardNumber)}>
                  <GameCard cardNumber={cardNumber} />
                </div>
              ))}
            </div>
          </div>
        </div>
        {showCardsPopup && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50">
            <div className="p-8 bg-white rounded shadow-lg text-center">
              <p>You won this card:</p>
              <div className="flex justify-center space-x-4 mb-4">
                {cards.length > 0 && <GameCard cardNumber={cards[cards.length - 1]} />}
              </div>
              <button onClick={closePopup} className="mt-4">
                Close
              </button>
            </div>
          </div>
        )}
        {/* <div className="h-[100px] max-w-[400px] rounded-md w-full bg-black bg-opacity-30 backdrop-blur-md">
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

            {/* Nom du joueur 
          </div>
          </> */}
      </div>
    </>
  );
};

export default PlayPanel;
