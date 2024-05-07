import { EventType, useLogs } from '@/hooks/useLogs';
import { useElementStore } from '@/utils/store';
import { Battle } from '@/utils/types';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import SupplyLog from './SupplyLog';
import { useGetPlayers } from '@/hooks/useGetPlayers';
import DefendLog from './DefendLog';
import FortifyLog from './FortifyLog';

// TODO: add swap de cards

const ActionLogs: React.FC = () => {
  const { logs } = useLogs();
  const { playerNames } = useGetPlayers();
  const { setHighlightedRegion, setBattleReport, battleReport } = useElementStore((state) => state);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const logsRef = useRef<HTMLDivElement>(null);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  const marchingSoundRef = useRef(new Audio('/music/marchingShort.mp3'));
  const swwordSoundRef = useRef(new Audio('/music/sword.mp3'));

  useEffect(() => {
    if (logsRef.current) {
      setContentHeight(logsRef.current.scrollHeight);
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
    if (logs.length > 0) {
      const lastLog = logs[logs.length - 1];
      switch (lastLog.type) {
        case EventType.Supply:
          marchingSoundRef.current.play();
          break;
        case EventType.Defend:
          swwordSoundRef.current.play();
          break;
        case EventType.Fortify:
          marchingSoundRef.current.play();
          break;
        default:
          break;
      }
    }
  }, [logs]);

  function handleRegionMouseOver(regionId: number) {
    setHighlightedRegion(regionId);
  }

  function handleRegionMouseLeave() {
    setHighlightedRegion(null);
  }

  const handleMouseClickOnBattle = useCallback(
    (battle: Battle | undefined) => {
      if (!battleReport) {
        setBattleReport(battle ? battle : null);
      }
    },
    [battleReport, setBattleReport]
  );

  // Animate the container height
  const springProps = useSpring({
    to: {
      height: isCollapsed ? 0 : contentHeight,
    },
    from: { height: 0 },
    config: { tension: 170, friction: 26 },
  });

  return (
    <div className="max-w-xl w-full border-2 rounded-lg bg-stone-700 border-stone-900 text-white vt323-font">
      <div
        className="flex justify-between items-center p-2 border-b border-stone-900 rounded-t cursor-pointer"
        onClick={toggleCollapse}
      >
        <span>{`Logs (${logs.length})`}</span>
        <span className="mr-2">{isCollapsed ? '▲' : '▼'}</span>
      </div>

      <animated.div style={springProps} ref={logsRef} className="max-h-48 overflow-x-auto scrollbar-custom">
        {logs.length !== 0 && (
          <div className="p-2 rounded-b text-start">
            {logs.map((log, index) => (
              <div key={index} className="text-sm mb-2 text-left">
                <span>{format(log.timestamp, 'HH:mm:ss')} - </span>
                {log.type === EventType.Supply && (
                  <SupplyLog
                    log={log}
                    playerNames={playerNames}
                    handleMouseOver={handleRegionMouseOver}
                    handleMouseLeave={handleRegionMouseLeave}
                  />
                )}
                {log.type === EventType.Defend && (
                  <DefendLog
                    log={log}
                    playerNames={playerNames}
                    handleMouseOver={handleRegionMouseOver}
                    handleMouseLeave={handleRegionMouseLeave}
                    handleMouseClickOnBattle={handleMouseClickOnBattle}
                  />
                )}
                {log.type === EventType.Fortify && (
                  <FortifyLog
                    log={log}
                    playerNames={playerNames}
                    handleMouseOver={handleRegionMouseOver}
                    handleMouseLeave={handleRegionMouseLeave}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </animated.div>
    </div>
  );
};

export default ActionLogs;
