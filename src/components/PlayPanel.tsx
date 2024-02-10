import { useDojo } from '@/DojoContext';
import { useGetCurrentPlayer } from '@/hooks/useGetCurrentPlayer';
import { usePhase } from '@/hooks/usePhase';
import { useTurn } from '@/hooks/useTurn';
import { colorPlayer } from '@/utils/colors';
import { useEffect, useState } from 'react';
import { avatars } from '../utils/pfps';
import { Phase, useElementStore } from '../utils/store';
import ActionPlayerPanel from './ActionPlayerPanel';
import CardMenu from './CardMenu';
import CardsPopup from './CardsPopup';
import OverlayWithText from './OverlayWithText';
import StatusPlayer from './StatusPlayer';
import ActionPanel from './ActionPanel';

const PlayPanel = () => {
  const {
    setup: {
      client: { play },
    },
    account: { account },
  } = useDojo();

  const { currentPlayer: player } = useGetCurrentPlayer();
  const { game } = useElementStore((state) => state);
  const { turn } = useTurn();
  const { phase } = usePhase();

  const [cards, setCards] = useState<number[]>([]);
  const [pendingCards, setPendingCards] = useState<number[]>([]);
  const [conqueredThisTurn, setConqueredThisTurn] = useState(false);
  const [showCardsPopup, setShowCardsPopup] = useState(false);
  const [showCardMenu, setShowCardMenu] = useState(false);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayText, setOverlayText] = useState('');

  const textFromState = (phase: Phase) => {
    switch (phase) {
      case Phase.DEPLOY:
        return 'Deploying';
      case Phase.ATTACK:
        return 'Attacking';
      case Phase.FORTIFY:
        return 'Fortifying';
      default:
        return 'Unknown'; // Consider handling unexpected cases or add a default message
    }
  };

  useEffect(() => {
    if (player?.conqueror === 1) {
      setConqueredThisTurn(true);
    }
  }, [player?.conqueror]);

  useEffect(() => {
    if (game && game.id != null) {
      if (conqueredThisTurn) {
        setCards(player.cards);
        setPendingCards(player.cards);
        setShowCardsPopup(true);
        setConqueredThisTurn(false);
      }

      const timer2 = setTimeout(() => {
        const text = textFromState(1);
        setOverlayText(text);
        setShowOverlay(true);
      }, 4500);

      const timer3 = setTimeout(() => {
        setShowOverlay(false);
      }, 6000);

      return () => {
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

  if (game === undefined || game === null) return null;
  if (player === undefined || player === null) return null;

  const color = colorPlayer[turn + 1];
  const image = avatars[turn + 1];

  const handleNextPhaseClick = () => {
    if (game.id == null || game.id == undefined) return;
    let text = '';
    if (phase < 3) {
      play.finish(account, game.id);
      text = textFromState(phase + 1);
      setOverlayText(text);
      setShowOverlay(true);
    } else {
      play.finish(account, game.id);
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
    if (game.id !== undefined && game.id !== null) {
      play.discard(account, game.id, selectedCards[0], selectedCards[1], selectedCards[2]);
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

  console.log(player);

  return (
    <>
      {showCardsPopup && <CardsPopup cards={cards} onClose={() => setShowCardsPopup(false)} />}
      <div className="fixed bottom-14 left-0 right-0 flex justify-center items-end p-4">
        {false && showOverlay && <OverlayWithText text={overlayText} />}
        {/* Section du panneau de jeu */}
        <ActionPlayerPanel toggleCardMenu={toggleCardMenu} cards={cards} />

        {/* Menu des cartes */}
        {showCardMenu && (
          <CardMenu
            cards={cards}
            selectedCards={selectedCards}
            onSelectCard={handleCardSelect}
            onDiscard={discardCards}
            onClose={() => setShowCardMenu(false)}
            isOpen={showCardMenu}
          />
        )}
        <div className="flex flex-col max-w-[350px] w-full " onClick={() => console.log('click')}>
          <ActionPanel></ActionPanel>
          {/* Barre d'état du joueur */}
          <StatusPlayer
            name={player.name}
            color={color}
            image={image}
            supply={player.supply}
            handleNextPhaseClick={handleNextPhaseClick}
            textFromState={textFromState}
            phase={phase}
          />
        </div>
      </div>
    </>
  );
};

export default PlayPanel;
