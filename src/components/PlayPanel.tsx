import { useDojo } from '@/DojoContext';
import { useComponentStates } from '@/hooks/useComponentState';
import { colorPlayer } from '@/utils/colors';
import { useComponentValue } from '@dojoengine/react';
import { EntityIndex } from '@latticexyz/recs';
import { avatars } from '../utils/pfps';
import { Phase, useElementStore } from '../utils/store';
import { useEffect, useState } from 'react';
import { feltToStr, unpackU128toNumberArray } from '@/utils/unpack';
import OverlayWithText from './OverlayWithText';
import ActionPlayerPanel from './ActionPlayerPanel';
import StatusPlayer from './StatusPlayer';
import CardsPopup from './CardsPopup';
import CardMenu from './CardMenu';

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
      {showCardsPopup && <CardsPopup cards={cards} onClose={() => setShowCardsPopup(false)} />}
      <div className="fixed bottom-14 left-0 right-0 flex justify-center items-end p-4 pointer-events-none">
        {showOverlay && <OverlayWithText text={overlayText} />}
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
        {/* Barre d'état du joueur */}
        <StatusPlayer
          name={name}
          color={color}
          image={image}
          supply={supply}
          handleNextPhaseClick={handleNextPhaseClick}
          textFromState={textFromState}
          current_state={current_state}
        />
      </div>
    </>
  );
};

export default PlayPanel;
