import { Phase } from '../utils/store';

interface StatusPlayerProps {
  image: string;
  phase: Phase;
  supply: number;
  handleNextPhaseClick: () => void;
}

export default function StatusPlayer({ image, phase, supply, handleNextPhaseClick }: StatusPlayerProps) {
  return (
    <>
      <div className="relative w-auto h-100 flex flex-col vt323-font text-white rounded-lg drop-shadow-lg">
        <div className="absolute -top-6 -left-5 w-24 h-24">
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

        <div className="flex h-20 bg-stone-700 border-2 border-stone-900 rounded-b-lg">
          <div className="flex w-2/3 justify-center items-center">
            <div className="h-10 rounded-lg px-4 py-2">{phase === Phase.DEPLOY && `Place: ${supply}`}</div>
          </div>
          <div className="flex w-1/3 justify-center items-center">
            <button
              className="h-10 bg-green-500 rounded-lg drop-shadow-lg px-4 py-2 hover:transform hover:-translate-y-1 transition-transform ease-in-out"
              onClick={handleNextPhaseClick}
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
