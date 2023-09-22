import RoundButton from "./roundButton";

const playPanel = () => {
  return (
    <div className="card flex flex-row items-center bg-gray-100 space-x-4 p-4 w-96">
      <RoundButton color="red" className="h-12 w-12"></RoundButton>

      <div className="flex-1 flex flex-col justify-center items-center space-y-4">
        {/* Three bars & text */}
        <div className="text-center">
          <div className="mb-2">Deploying</div>
          <div className="flex flex-row">
            <div className="h-2 w-16 bg-gray-500 rounded-full"></div>
            <div className="h-2 w-16 bg-gray-500 mx-2 rounded-full"></div>
            <div className="h-2 w-16 bg-gray-500 rounded-full"></div>
          </div>
        </div>

        {/* Next phase button */}
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Next Phase
        </button>
      </div>

      <RoundButton color="green" className="h-12 w-12"></RoundButton>
    </div>
  );
};

export default playPanel;
