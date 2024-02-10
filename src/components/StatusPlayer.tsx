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
    <>
      <div className="relative w-auto h-100 flex flex-col vt323-font text-white">
        {/* Player Avatar, positioned at the top-left corner */}
        <div className="absolute -top-6 -left-6 w-24 h-24">
          <img src={image} alt="player" className="rounded-full border-4 border-stone-900" />
        </div>
        <div className="flex bg-stone-700 border-x-2 border-t-2 border-stone-900 h-[2.4em] justify-center rounded-t-lg">
          <div className="w-1/6"></div>
          <div className="w-5/6">
            <button className={`w-1/3 h-full  ${phase === Phase.DEPLOY && 'bg-stone-900'} border-r-2 border-stone-900`}>
              DEPLOY
            </button>
            <button className={`w-1/3 h-full  ${phase === Phase.ATTACK && 'bg-stone-900'} border-r-2 border-stone-900`}>
              ATTACK
            </button>
            <button className={`w-1/3 h-full ${phase === Phase.FORTIFY && 'bg-stone-900'} `}>MOVE</button>
          </div>
        </div>

        <div className="flex pb-4 bg-stone-700 border-2 border-stone-900 rounded-b-lg">
          {/* Content for middle, which fills remaining height */}
          <div className="pt-8 flex flex-wrap basis-2/3 overflow-auto justify-center align-middle">
            <div className=" bg-gray-900 rounded px-3 py-2">Place 3/30</div>
          </div>
          <div className="pt-8  flex flex-wrap basis-1/3 overflow-auto justify-center align-middle">
            <button className="bg-green-500  rounded px-4 py-2" onClick={handleNextPhaseClick}>
              NEXT
            </button>
          </div>
        </div>
      </div>

      {/* <div className="h-[100px]  rounded-md w-full bg-black bg-opacity-30 backdrop-blur-md">
        <div className="relative w-full h-full">

          <div className="absolute h-[120px] w-[120px] rounded-full bg-customRed-400 -left-[25px] -top-[25px] z-10">
            <img src={image} alt={'player'} className="rounded-full" />
          </div>

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

          <div className="flex h-[60px] items-center justify-center">
            <span className="text-white text-2xl uppercase font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
              {textFromState(phase)}
            </span>
          </div>

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
      </div> */}
    </>
  );
}
