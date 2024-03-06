import React, { useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import SidePlayerInfo from './SidePlayerInfo';
import { useMe } from '@/hooks/useMe';
import { usePhase } from '@/hooks/usePhase';
import { useGetCurrentPlayer } from '@/hooks/useGetCurrentPlayer';
import { Player } from '@/utils/types';
import { useGame } from '@/hooks/useGame';
import { useDojo } from '@/dojo/useDojo';

type PlayersPanelProps = {
  players: Player[];
};

const PlayersPanel = ({ players }: PlayersPanelProps) => {
  const {
    setup: {
      client: { play },
    },
    account: { account },
  } = useDojo();
  const playersRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const game = useGame();

  useEffect(() => {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const elapsedTimeSinceGameStart = currentTimeInSeconds - game.clock;
    const timeWithPenalty = Math.max(0, game.penalty - elapsedTimeSinceGameStart);
    setTimeLeft(timeWithPenalty);
  }, [game.clock, game.penalty]);

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const { isItMyTurn } = useMe();
  const { phaseName } = usePhase();
  const { currentPlayer } = useGetCurrentPlayer();

  const banPlayer = async () => {
    await play.banish(account, game.id);
  };

  useEffect(() => {
    if (playersRef.current) {
      setContentHeight(playersRef.current.scrollHeight);
    }
  }, [players]);

  // Animate the container height
  const springProps = useSpring({
    to: {
      height: isCollapsed ? 0 : contentHeight,
    },
    from: { height: 0 },
    config: { tension: 170, friction: 26 },
  });

  return (
    <div className="max-w-xl w-full border-2 rounded-lg bg-stone-700 border-stone-900 text-white">
      <div
        className="flex justify-between items-center p-2 border-b border-stone-900 rounded-t cursor-pointer vt323-font"
        onClick={toggleCollapse}
      >
        <span>{`Players (${players.length})`}</span>
        <span className="mr-2">{isCollapsed ? '▲' : '▼'}</span>
      </div>

      <animated.div style={springProps} ref={playersRef} className="max-h scrollbar-custom">
        {players.map((player: any, index: number) => (
          <div key={index}>
            {!isCollapsed && !isItMyTurn && currentPlayer && currentPlayer.index === index && (
              <div className="absolute -left-24 mt-4 flex justify-center items-center h-14 w-24 rounded-l-lg bg-stone-900 text-stone-500 flex-col">
                <span className="vt323-font text-white">{phaseName} ▶︎</span>
                {timeLeft > 0 ? (
                  <span className="vt323-font text-white ml-2 mb-1">{timeLeft}</span>
                ) : (
                  <button
                    className="vt323-font text-white ml-2 px-1 border-white border-[1px] rounded-lg"
                    onClick={banPlayer}
                  >
                    BAN
                  </button>
                )}
              </div>
            )}
            <div className="relative overflow-hidden">
              <SidePlayerInfo key={index} index={index} player={player} />
            </div>
          </div>
        ))}
      </animated.div>
    </div>
  );
};

export default PlayersPanel;
