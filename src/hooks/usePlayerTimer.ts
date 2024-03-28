import { useEffect, useState } from 'react';

interface UseElapsedTimeTimerProps {
  startTime: number; // Start time in seconds
  penalty: number; // Penalty time in seconds
}

const usePlayerTimer = ({ startTime, penalty }: UseElapsedTimeTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    // Calculate initial time left considering penalty
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const elapsedTimeSinceStart = currentTimeInSeconds - startTime;
    const initialTimeWithPenalty = Math.max(0, penalty - elapsedTimeSinceStart);
    setTimeLeft(initialTimeWithPenalty);
  }, [startTime, penalty]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(0, prevTime - 1));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  return timeLeft;
};

export default usePlayerTimer;
