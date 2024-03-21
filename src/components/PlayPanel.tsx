import { usePhase } from '@/hooks/usePhase';
import { useTurn } from '@/hooks/useTurn';
import { useEffect, useState } from 'react';
import { Phase, useElementStore } from '../utils/store';
import { getPhaseName } from '@/utils/textState';
import ActionPanel from './ActionPanel';
import CardMenu from './CardMenu';
import EndTurnPopup from './EndTurnPopup';
import OverlayWithText from './OverlayWithText';
import StatusPlayer from './StatusPlayer';
import { useDojo } from '@/dojo/useDojo';
import { useGame } from '@/hooks/useGame';
import { useMe } from '@/hooks/useMe';
import CardPanelButton from './CardPanelButton';
import Bubble from './Bubble';
import { canBeExchanged, cardTypeFromNumber } from '@/utils/cards';
import { toast } from './ui/use-toast';
import DynamicOverlayTuto from './DynamicOverlayTuto';
import tutorialData from '../data/tutorialSteps.json';

const PlayPanel = () => {
  const {
    setup: {
      client: { play },
    },
    account: { account },
  } = useDojo();

  const { me: player, isItMyTurn } = useMe();
  const { turn } = useTurn();
  const { phase } = usePhase();

  const { current_source, setTilesConqueredThisTurn } = useElementStore((state) => state);

  const game = useGame();

  const [cards, setCards] = useState<number[]>([]);
  const [conqueredThisTurn, setConqueredThisTurn] = useState(false);
  const [showCardsPopup, setShowCardsPopup] = useState(false);
  const [showCardMenu, setShowCardMenu] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayText, setOverlayText] = useState('');

  const tutorialCompleted = localStorage.getItem('tutorialCompleted');

  useEffect(() => {
    if (player?.conqueror) {
      setConqueredThisTurn(true);
    }
  }, [player?.conqueror]);

  useEffect(() => {
    if (conqueredThisTurn) {
      setShowCardsPopup(true);
      setConqueredThisTurn(false);
    }
  }, [turn]);

  useEffect(() => {
    if (isItMyTurn) {
      const text = getPhaseName(Phase.DEPLOY);
      setOverlayText(text);
      setShowOverlay(true);

      const timer = setTimeout(() => {
        setShowOverlay(false);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isItMyTurn]);

  useEffect(() => {
    if (player) {
      setCards(player.cards);
    }
  }, [player]);

  useEffect(() => {
    let timer: any;
    if (showCardsPopup) {
      timer = setTimeout(() => {
        setShowCardsPopup(false);
        setTilesConqueredThisTurn([]);
      }, 6000);
    }
    return () => clearTimeout(timer);
  }, [showCardsPopup]);

  const [showBubble, setShowBubble] = useState(false);
  const [texts, setTexts] = useState<string[]>([]);

  useEffect(() => {
    if (isItMyTurn && phase === Phase.DEPLOY) {
      if (player) {
        if (canBeExchanged(player.cards.map((c) => cardTypeFromNumber(c))))
          setTexts(['It is now your turn, my Lord!', 'You can exchange cards if you want.']);
        else setTexts(['It is now your turn, my Lord!']);
      }
      setShowBubble(true); // Show the Bubble at the start of the turn
    } else {
      setTexts([]);
      setShowBubble(false); // Hide the Bubble otherwise
    }
  }, [isItMyTurn, phase]);

  useEffect(() => {
    if (current_source !== null) {
      setShowBubble(false);
    }
  }, [current_source]);

  if (game === undefined || game === null) return null;
  if (player === undefined || player === null) return null;

  const handleNextPhaseClick = async () => {
    if (game.id == null || game.id == undefined) return;
    setShowBubble(false);

    if (phase === Phase.DEPLOY) {
      if (player.cards.length === 5) {
        setTexts(['My Lord, exchange your cards first!']);
        setShowBubble(true);
        return;
      } else if (player.supply !== 0) {
        setTexts([`You have ${player.supply} supplies to deploy first!`]);
        setShowBubble(true);
        return;
      }
      try {
        await play.finish(account, game.id);
      } catch (error: any) {
        toast({
          variant: 'destructive',
          description: <code className="text-white text-xs">{error.message}</code>,
        });
      }
    } else {
      await play.finish(account, game.id);
    }

    setOverlayText(getPhaseName(phase + 1));
    if (!(phase === Phase.FORTIFY && conqueredThisTurn) && player.supply === 0) {
      setShowOverlay(true);
    }

    const timer = setTimeout(() => {
      setShowOverlay(false);
    }, 1000);

    return () => clearTimeout(timer);
  };

  const toggleCardMenu = () => {
    setShowCardMenu(!showCardMenu);
  };

  return (
    <>
      {showCardsPopup && (
        <EndTurnPopup cards={cards.map((c) => cardTypeFromNumber(c))} onClose={() => setShowCardsPopup(false)} />
      )}
      {showOverlay && tutorialCompleted && <OverlayWithText text={overlayText} />}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 flex justify-center items-end p-4">
        {/* Section du panneau de jeu */}
        <DynamicOverlayTuto tutorialStep="8" texts={tutorialData['8']}>
          <CardPanelButton cards={cards} toggleCardMenu={toggleCardMenu} />
        </DynamicOverlayTuto>

        {/* Menu des cartes */}
        {showCardMenu && <CardMenu cards={cards} onClose={() => setShowCardMenu(false)} />}
        <div className="flex flex-col max-w-[420px] w-full z-20 pointer-events-auto">
          <div className="mb-8 vt323-font">
            <ActionPanel />
          </div>
          {showBubble && (
            <div className="w-auto ">
              <Bubble texts={texts} variant="speech" />
            </div>
          )}

          {/* Barre d'état du joueur */}
          <StatusPlayer handleNextPhaseClick={handleNextPhaseClick} />
        </div>
      </div>
    </>
  );
};

export default PlayPanel;
