import { useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import SidePlayerInfo from './SidePlayerInfo';

type PlayersPanelProps = {
  players: any;
};

const PlayersPanel = ({ players }: PlayersPanelProps) => {
  const playersRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  useEffect(() => {
    if (playersRef.current) {
      setContentHeight(playersRef.current.scrollHeight);
    }
  }, [isCollapsed]);

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
        <span>Players</span>
        <span className="mr-2">{isCollapsed ? '▲' : '▼'}</span>
      </div>

      <animated.div style={springProps} ref={playersRef} className="max-h overflow-hidden scrollbar-custom">
        {players.map((player: any, index: number) => (
          <SidePlayerInfo key={index} index={index} player={player} />
        ))}
      </animated.div>
    </div>
  );
};

export default PlayersPanel;
