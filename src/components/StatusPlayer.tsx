import { colorClasses } from '@/utils/colors';
import { FaChevronRight } from 'react-icons/fa6';
import { GiBattleGear } from 'react-icons/gi';
import { Phase } from '../utils/store';

interface StatusPlayerProps {
  image: string;
  phase: Phase;
  name: string;
  color: string;
  supply: number;
  textFromState: (state: number) => string;
  handleNextPhaseClick: () => void;
}

export default function StatusPlayer({
  image,
  phase,
  name,
  color,
  supply,
  textFromState,
  handleNextPhaseClick,
}: StatusPlayerProps) {
  return (
    <div className="h-[100px]  rounded-md w-full bg-black bg-opacity-30 backdrop-blur-md">
      <div className="relative w-full h-full">
        {/* Image du joueur */}
        <div className="absolute h-[120px] w-[120px] rounded-full bg-red-400 -left-[25px] -top-[25px] z-10">
          <img src={image} alt={'player'} className="rounded-full" />
        </div>
        {/* Barre d'état */}
        <div className="flex flex-row justify-center mt-1">
          <div
            className={`h-2 w-16 rounded-full ${phase === Phase.DEPLOY ? colorClasses[color] : 'bg-gray-500'}`}
          ></div>
          <div
            className={`h-2 w-16 mx-2 rounded-full ${phase === Phase.ATTACK ? colorClasses[color] : 'bg-gray-500'}`}
          ></div>
          <div
            className={`h-2 w-16 rounded-full ${phase === Phase.FORTIFY ? colorClasses[color] : 'bg-gray-500'}`}
          ></div>
        </div>
        {/* Texte d'état */}
        <div className="flex h-[60px] items-center justify-center">
          <span className="text-white text-2xl uppercase font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
            {textFromState(phase)}
          </span>
        </div>
        {/* Bouton "Next Phase" */}
        <div
          className={`absolute flex justify-center h-[120px] w-[120px] rounded-full -right-[25px] -top-[25px] z-10 ${colorClasses[color]} border-8 ${colorClasses[color]} pointer-events-auto`}
        >
          {phase === Phase.DEPLOY && supply > 0 && (
            <div className="flex flex-row gap-1 items-center text-4xl text-white drop-shadow-[0_6.2px_8.2px_rgba(0,0,0,0.8)]">
              <p className="font-space-mono">{supply}</p>
              <GiBattleGear />
            </div>
          )}
          {supply === 0 && (
            <button
              className="absolute top-1 flex justify-center items-center w-[80px] h-[80px] rounded-full active:translate-y-2  active:[box-shadow:0_0px_0_0_#15803d]
        active:border-b-[0px]
        transition-all duration-150 [box-shadow:0_8px_0_0_#15803d]
        border-[1px] border-green-700 bg-green-600 hover:transform hover:-translate-y-1 transition-transform ease-in-out"
              onClick={handleNextPhaseClick}
            >
              {phase === Phase.FORTIFY ? (
                <span className="text-white text-md uppercase font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  End Turn
                </span>
              ) : (
                <FaChevronRight className="h-[50px] w-[50px] text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]" />
              )}
            </button>
          )}
        </div>
        <div
          className={`absolute flex justify-center items-center h-[50px] w-full  -bottom-[25px] rounded-md drop-shadow-[0_6.2px_8.2px_rgba(0,0,0,0.8)]  ${colorClasses[color]}`}
        >
          <span className="text-white uppercase font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">{name}</span>
        </div>
      </div>
    </div>
  );
}
