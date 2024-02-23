import React, { useEffect, useState } from 'react';
import Dice from './Dice/Dice';
import { useLogs } from '@/hooks/useLogs';
import { feltToStr } from '@/utils/unpack';
import { Swords } from 'lucide-react';
import { Button } from './ui/button';

const OverlayDice: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { lastDefendResult } = useLogs();

  const [showDice, setShowDice] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [diceValue, setDiceValue] = useState([7, 7]);

  useEffect(() => {
    if (lastDefendResult) {
      // After 1 second, set showDice to false to hide the Dice component
      const timer = setTimeout(() => {
        //setShowDice(false);
        setShowResult(true);
      }, 1000);

      // Clear the timeout when the component unmounts or when lastDefendResult changes

      const randomValue = Math.floor(Math.random() * (6 - 2 + 1) + 2);
      const newRandomValue = Math.floor(Math.random() * (randomValue - 1 + 1) + 1);
      if (parseInt(lastDefendResult.data[1]) === 1) {
        setDiceValue([newRandomValue, randomValue]);
      } else {
        setDiceValue([randomValue, newRandomValue]);
      }

      setShowDice(true);
      return () => clearTimeout(timer);
    }
  }, [lastDefendResult]);

  console.log(lastDefendResult);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-[1000]"
      style={{
        background: 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)',
      }}
    >
      <Button
        onClick={onClose}
        className="absolute top-6 right-6 flex items-center justify-center p-1 w-[22px] h-[22px] bg-red-500 text-white rounded-full text-xs z-[1000]"
      >
        ✕
      </Button>

      <div className="flex flex-col gap-6">
        <div className="flex justify-center items-center gap-6">
          {showDice && (
            <>
              <div>
                <Dice desiredResult={diceValue[0]} />
              </div>
              <Swords className="w-24 h-24 text-white" />
              <div>
                <Dice desiredResult={diceValue[1]} />
              </div>
            </>
          )}
        </div>
        {showResult && (
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
                    <div className="text-green-500">A glorious victory !</div>
                  ) : (
                    <div className="text-red-500">A crushing defeat !</div>
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
