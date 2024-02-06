import { LogType } from '@/hooks/useLogs';
import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';

//TODO ADD SWAP DE CARDS

const ActionLogs: React.FC<{ logs: LogType[] }> = ({ logs }) => {
  const logsRef = useRef<HTMLDivElement>(null);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  useEffect(() => {
    logs.map((l: LogType) => console.log(`[${l.log}]`, l.timestamp));
  }, [logs]);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

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
              <span className="text-gray-500">{format(log.timestamp, 'HH:mm:ss')}</span> - {log.log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionLogs;
