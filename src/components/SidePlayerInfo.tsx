interface SidePlayerInfoProps {
  image: string;
  name: string;
  color: string;
  troops: number;
  territories: number;
  cards: number;
}

const SidePlayerInfo: React.FC<SidePlayerInfoProps> = ({
  image,
  name,
  color,
  troops,
  territories,
  cards,
}) => {
  return (
    <>
      <div
        className={`relative flex flex-row items-center bg-${color}-500 rounded-l-lg box-shadow-md mb-2 pl-3 py-3`}
      >
        <div className="flex flex-col items-end mr-1 flex-grow pr-3">
          <p className="text-right">{name}</p>
          <p>Troupes : {troops}</p>
          <p>Territoires : {territories}</p>
        </div>
        <img src={image} alt={color} />
        <div className="absolute top-3 transform -translate-y-1/2 -rotate-6 bg-white text-black px-2 py-1 rounded">
          {cards ? cards : 0}
        </div>
      </div>
    </>
  );
};

export default SidePlayerInfo;
