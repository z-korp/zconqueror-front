import React, { useEffect, useState } from 'react';
import Dice from './Dice/Dice';
import { useLogs } from '@/hooks/useLogs';
import { feltToStr } from '@/utils/unpack';
import { Shield, Swords } from 'lucide-react';

const round = 1;

const OverlayDice: React.FC<{}> = () => {
  const { lastDefendResult } = useLogs();

  const [showDice, setShowDice] = useState(true);

  useEffect(() => {
    if (lastDefendResult) {
      // After 1 second, set showDice to false to hide the Dice component
      const timer = setTimeout(() => {
        setShowDice(false);
      }, 1500);

      // Clear the timeout when the component unmounts or when lastDefendResult changes
      return () => clearTimeout(timer);
    }
  }, [lastDefendResult]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-[1000]"
      style={{
        background: 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)',
      }}
    >
      <div className="flex relative justify-center items-center">
        {showDice && (
          <>
            <div className="absolute" style={{ transform: `translate(50px,-50px)` }}>
              <Dice currentRound={round} />
            </div>
            <div className="absolute" style={{ transform: `translate(-50px,50px)` }}>
              <Dice currentRound={round} />
            </div>
          </>
        )}
        {!showDice && (
          <div className="text-white text-4xl">
            {lastDefendResult ? (
              <>
                <span className="flex justify-center items-center gap-6">
                  <span className="text-6xl font-bold">{feltToStr(lastDefendResult.keys[2])}</span>
                  <Swords className="inline-block w-8 h-8" />
                  <span>ATTACK</span>
                  <Swords className="inline-block w-8 h-8" />
                  <span className="text-6xl font-bold">{feltToStr(lastDefendResult.keys[3])}</span>
                </span>
                <div className="mt-6">
                  {Boolean(parseInt(lastDefendResult.data[1])) ? (
                    <div className="text-green">A glorious victory !</div>
                  ) : (
                    <div className="text-red">A crushing defeat !</div>
                  )}
                </div>
              </>
            ) : (
              'No defend result'
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverlayDice;
