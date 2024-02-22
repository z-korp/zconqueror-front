import React, { useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import SidePlayerInfo from './SidePlayerInfo';
import { useMe } from '@/hooks/useMe';
import { usePhase } from '@/hooks/usePhase';
import { useGetCurrentPlayer } from '@/hooks/useGetCurrentPlayer';

type PlayersPanelProps = {
  players: any;
};

const PlayersPanel = ({ players }: PlayersPanelProps) => {
  const playersRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const { isItMyTurn } = useMe();
  const { phaseName } = usePhase();
  const { currentPlayer } = useGetCurrentPlayer();

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

  console.log('currentPlayer', currentPlayer);

  return (
    <div className="max-w-xl w-full border-2 rounded-lg bg-stone-700 border-stone-900 text-white">
      <div
        className="flex justify-between items-center p-2 border-b border-stone-900 rounded-t cursor-pointer vt323-font"
        onClick={toggleCollapse}
      >
        <span>Players</span>
        <span className="mr-2">{isCollapsed ? '▲' : '▼'}</span>
      </div>

      <animated.div style={springProps} ref={playersRef} className="max-h  scrollbar-custom">
        {players.map((player: any, index: number) => (
          <div key={index}>
            {!isCollapsed && !isItMyTurn && currentPlayer && currentPlayer.index === index && (
              <div className="absolute -left-24 mt-4 flex justify-center items-center h-10 w-24 rounded-l-lg mr-1 bg-stone-900 text-stone-500">
                <span className="vt323-font text-white">{phaseName} ▶︎</span>
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
