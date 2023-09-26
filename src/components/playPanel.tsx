import { useState } from "react";
import RoundButton from "./roundButton";

interface PlayPanelProps {
  currentStateProp: number;
}

const PlayPanel = ({ currentStateProp: currentPhase }: PlayPanelProps) => {
  const [currentState, setCurrentState] = useState(currentPhase);

  let phaseText = "";
  if (currentState === 1) {
    phaseText = "Deploying";
  } else if (currentState === 2) {
    phaseText = "Attacking";
  } else if (currentState === 3) {
    phaseText = "Fortifying";
  }

  const handleNextPhaseClick = () => {
    if (currentState < 3) {
      setCurrentState(currentState + 1);
    } else {
      setCurrentState(1);
    }
  };

  const buttonText = currentState === 3 ? "End turn" : "Next Phase";

  return (
    <div className="card flex flex-row items-center p-4 w-96">
      <RoundButton color="red" className="h-12 w-12 mb-5"></RoundButton>

      <div className="flex-1 flex flex-col justify-center items-center space-y-4  bg-red-100">
        {/* Three bars & text */}
        <div className="text-center">
          <div className="mb-2">{phaseText}</div>
          <div className="flex flex-row">
            <div
              className={`h-2 w-16 rounded-full ${
                currentState === 1 ? "bg-red-500" : "bg-gray-500"
              }`}
            ></div>
            <div
              className={`h-2 w-16 mx-2 rounded-full ${
                currentState === 2 ? "bg-red-500" : "bg-gray-500"
              }`}
            ></div>
            <div
              className={`h-2 w-16 rounded-full ${
                currentState === 3 ? "bg-red-500" : "bg-gray-500"
              }`}
            ></div>
          </div>
        </div>

        {/* Next phase button */}
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          onClick={handleNextPhaseClick}
        >
          {buttonText}
        </button>
      </div>

      <RoundButton color="green" className="h-12 w-12 mb-5"></RoundButton>
    </div>
  );
};

export default PlayPanel;
