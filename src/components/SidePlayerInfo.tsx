interface SidePlayerInfoProps {
  image: string;
  color: string;
  troops: number;
  territories: number;
  cards: number;
}

const SidePlayerInfo: React.FC<SidePlayerInfoProps> = ({
  image,
  color,
  troops,
  territories,
  cards,
}) => {
  return (
    <>
      <div
        className={`flex flex-row items-center bg-${color}-500 border-radius-lg box-shadow-md mb-2`}
      >
        <div className="flex flex-col items-start mr-4">
          <p>Troupes : {troops}</p>
          <p>Territoires : {territories}</p>
          {/* <p>Cartes : {cards}</p> */}
        </div>
        <img src={image} alt={color} />
      </div>
    </>
  );
};

export default SidePlayerInfo;
