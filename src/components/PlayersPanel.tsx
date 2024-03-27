import { useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import SidePlayerInfo from './SidePlayerInfo';
import { useMe } from '@/hooks/useMe';
import { usePhase } from '@/hooks/usePhase';
import { useGetCurrentPlayer } from '@/hooks/useGetCurrentPlayer';
import { Player } from '@/utils/types';
import { useGame } from '@/hooks/useGame';
import { useDojo } from '@/dojo/useDojo';
import { Button } from './ui/button';
import usePlayerTimer from '@/hooks/usePlayerTimer';

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

  const timeLeft = usePlayerTimer({
    startTime: game.clock,
    penalty: game.penalty,
  });

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
            {!isCollapsed && currentPlayer && currentPlayer.index === index && (
              <div className="absolute -left-24 mt-4 flex justify-center items-center h-14 w-24 rounded-l-lg bg-stone-900 text-stone-500 flex-col">
                <span className="vt323-font text-white">{phaseName} ▶︎</span>
                {timeLeft > 0 && <span className="vt323-font text-white mb-1">{timeLeft}</span>}
                {timeLeft === 0 && !isItMyTurn && (
                  <Button
                    className="vt323-font text-white px-3 py-1 text-xs h-fit border-white border-[1px] rounded-lg"
                    onClick={banPlayer}
                  >
                    BAN
                  </Button>
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
