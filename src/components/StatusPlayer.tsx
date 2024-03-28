import { Phase, useElementStore } from '../utils/store';
import { avatars } from '@/utils/pfps';
import { useMe } from '@/hooks/useMe';
import { usePhase } from '@/hooks/usePhase';
import { Button } from './ui/button';
import DynamicOverlayTuto from './DynamicOverlayTuto';
import tutorialData from '../data/tutorialSteps.json';
import EmoteWheel from './EmoteWheel';
import { useState } from 'react';
import { useDojo } from '@/dojo/useDojo';

interface StatusPlayerProps {
  handleNextPhaseClick: () => void;
  isBtnNextPhaseDisabled: boolean;
}

const StatusPlayer: React.FC<StatusPlayerProps> = ({ handleNextPhaseClick, isBtnNextPhaseDisabled }) => {
  const {
    setup: {
      client: { play },
    },
    account: { account },
  } = useDojo();

  const { game_id } = useElementStore();

  const { me: player, isItMyTurn } = useMe();
  const { phase } = usePhase();
  const [selectedEmote, setSelectedEmote] = useState('');

  if (!player) return null;

  const image = avatars[player.index + 1];

  const handleEmoteSelect = (emote: string) => {
    setSelectedEmote(emote);
    if (game_id == null || game_id == undefined) return;
    play.emote(account, game_id, emote);
    console.log('selected emote', emote);
  };

  return (
    <>
      <div className="relative w-auto h-100 flex flex-col vt323-font text-white rounded-lg drop-shadow-lg">
        <div className="absolute -top-6 -left-5 w-24 h-24">
          <EmoteWheel onSelect={handleEmoteSelect}>
            <button>
              <img src={image} alt="player" className="rounded-full border-4 border-stone-900" />
            </button>
          </EmoteWheel>
        </div>
        <div className="flex bg-stone-700 border-x-2 border-t-2 border-stone-900 h-[2.4em] justify-center rounded-t-lg">
          <div className="w-1/6"></div>
          <div className="w-5/6 flex">
            <div
              className={`w-1/3 h-full flex items-center justify-center ${
                isItMyTurn && phase === Phase.DEPLOY && 'bg-stone-900'
              } border-r-2 border-stone-900`}
            >
              DEPLOY
            </div>
            <div
              className={`w-1/3 h-full flex items-center justify-center ${
                isItMyTurn && phase === Phase.ATTACK && 'bg-stone-900'
              } border-r-2 border-stone-900`}
            >
              ATTACK
            </div>
            <div
              className={`w-1/3 flex items-center justify-center h-full ${
                isItMyTurn && phase === Phase.FORTIFY && 'bg-stone-900'
              } `}
            >
              MOVE
            </div>
          </div>
        </div>

        <div className="flex h-20 bg-stone-700 border-2 border-stone-900 rounded-b-lg">
          <div className="flex w-2/3 justify-center items-center">
            <div className="h-10 rounded-lg px-4 py-2 ml-5 text-lg">
              {phase === Phase.DEPLOY && `Supplies available: ${player.supply}`}
            </div>
          </div>
          <div className="flex w-1/3 justify-center items-center">
            <DynamicOverlayTuto tutorialStep="3" texts={tutorialData['3']}>
              {isItMyTurn && (
                <Button
                  className="h-10 bg-green-500 rounded-lg drop-shadow-lg px-4 py-2 hover:transform hover:-translate-y-1 transition-transform ease-in-out"
                  onClick={handleNextPhaseClick}
                  isLoading={isBtnNextPhaseDisabled}
                  disabled={isBtnNextPhaseDisabled}
                >
                  NEXT
                </Button>
              )}
            </DynamicOverlayTuto>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusPlayer;
