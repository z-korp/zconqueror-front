import { EventType, LogType } from '@/hooks/useLogs';
import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { getIdFromName } from '@/utils/events';
import { useElementStore } from '@/utils/store';

//TODO ADD SWAP DE CARDS

const ActionLogs: React.FC<{ logs: LogType[] }> = ({ logs }) => {
  const logsRef = useRef<HTMLDivElement>(null);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const { setHighlightedRegion } = useElementStore((state) => state);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  useEffect(() => {
    logs.map((l: LogType) => console.log(`[${l.log}]`, l.timestamp));
  }, [logs]);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  function handleMouseOver(logEntry: string) {
    setHighlightedRegion(getIdFromName(logEntry));
  }

  function handleMouseLeave() {
    setHighlightedRegion(null);
  }

  return (
    <div className="max-w-xl w-full">
      <div
        className="flex justify-between items-center px-4 py-2 bg-gray-700 rounded-t cursor-pointer text-white vt323-font"
        onClick={toggleCollapse}
      >
        <span>Logs</span>
        <span>{isCollapsed ? '▼' : '▲'}</span>
      </div>
      {!isCollapsed && (
        <div ref={logsRef} className="overflow-auto h-48 p-4 bg-gray-700 rounded-b">
          {logs.map((log, index) => (
            <div key={index} className="text-sm mb-2">
              <span className="text-gray-500">{format(log.timestamp, 'HH:mm:ss')}</span> -
              {log.type === EventType.Supply && (
                <>
                  <span className="text-gray-500">{log.log[0]} </span>
                  <span
                    className="text-gray-500 underline"
                    onMouseOver={() => handleMouseOver(log.log[1])}
                    onMouseLeave={handleMouseLeave}
                  >
                    {log.log[1]}
                  </span>
                </>
              )}
              {log.type === EventType.Defend && (
                <>
                  <span className="text-gray-500">{log.log[0]} </span>
                  <span
                    className="text-gray-500 underline"
                    onMouseOver={() => handleMouseOver(log.log[1])}
                    onMouseLeave={handleMouseLeave}
                  >
                    {log.log[1]}
                  </span>
                  <span className="text-gray-500"> {log.log[2]}</span>
                </>
              )}
              {log.type === EventType.Fortify && (
                <>
                  <span className="text-gray-500">{log.log[0]} </span>
                  <span
                    className="text-gray-500 underline"
                    onMouseOver={() => handleMouseOver(log.log[1])}
                    onMouseLeave={handleMouseLeave}
                  >
                    {log.log[1]}
                  </span>
                  <span className="text-gray-500"> {log.log[2]} </span>
                  <span
                    className="text-gray-500 underline"
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
    </div>
  );
};

export default ActionLogs;
