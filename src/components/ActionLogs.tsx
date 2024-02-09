import { EventType, LogType, useLogs } from '@/hooks/useLogs';
import { getIdFromName } from '@/utils/events';
import { useElementStore } from '@/utils/store';
import { format } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';

// TODO: add swap de cards

const ActionLogs: React.FC = () => {
  const { logs } = useLogs();

  const logsRef = useRef<HTMLDivElement>(null);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const { setHighlightedRegion } = useElementStore((state) => state);
  // Dynamically calculate content height for animation
  const [contentHeight, setContentHeight] = useState(0);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  useEffect(() => {
    logs.map((l: LogType) => console.log(`[${l.log}]`, l.timestamp));
  }, [logs]);

  useEffect(() => {
    if (logsRef.current) {
      console.log(logsRef.current.scrollHeight);
      setContentHeight(logsRef.current.scrollHeight);
    }
  }, [logs, isCollapsed]);

  function handleMouseOver(logEntry: string) {
    setHighlightedRegion(getIdFromName(logEntry));
  }

  function handleMouseLeave() {
    setHighlightedRegion(null);
  }

  // Animate the container height
  const springProps = useSpring({
    to: {
      height: isCollapsed ? 0 : contentHeight,
    },
    from: { height: 0 },
    config: { tension: 170, friction: 26 },
  });

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="max-w-xl w-full border-2 rounded-lg bg-stone-700 border-stone-900 text-white vt323-font">
      <div
        className="flex justify-between items-center p-2 border-b border-stone-900  rounded-t cursor-pointer"
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
                  <>
                    <span>{log.log[0]} </span>
                    <span
                      className="underline cursor-pointer hover:text-yellow-500"
                      onMouseOver={() => handleMouseOver(log.log[1])}
                      onMouseLeave={handleMouseLeave}
                    >
                      {log.log[1]}
                    </span>
                  </>
                )}
                {log.type === EventType.Defend && (
                  <>
                    <span>{log.log[0]} </span>
                    <span
                      className="underline cursor-pointer hover:text-yellow-500"
                      onMouseOver={() => handleMouseOver(log.log[1])}
                      onMouseLeave={handleMouseLeave}
                    >
                      {log.log[1]}
                    </span>
                    <span> {log.log[2]}</span>
                  </>
                )}
                {log.type === EventType.Fortify && (
                  <>
                    <span>{log.log[0]} </span>
                    <span
                      className="underline cursor-pointer hover:text-yellow-500"
                      onMouseOver={() => handleMouseOver(log.log[1])}
                      onMouseLeave={handleMouseLeave}
                    >
                      {log.log[1]}
                    </span>
                    <span> {log.log[2]} </span>
                    <span
                      className="cursor-pointer hover:text-yellow-500 underline"
                      onMouseOver={() => handleMouseOver(log.log[3])}
                      onMouseLeave={handleMouseLeave}
                    >
                      {log.log[3]}
                    </span>
                  </>
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
