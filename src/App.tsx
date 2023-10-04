import { useEffect, useState } from 'react';
import { shortString } from 'starknet';
import './App.css';
import { useDojo } from './DojoContext';
import persoImage from './assets/perso.png';
import NewGame from './components/NewGame';
import Map from './components/map/map';
import PlayPanel from './components/playPanel';
import SidePlayerInfo from './components/sidePlayerInfo';
import { useComponentStates } from './hooks/useComponentState';
import useIP from './hooks/useIp';
import { colorPlayer } from './utils/colors';
import { useElementStore } from './utils/store';

interface Player {
  color: string;
  address: string;
  name: string;
  supply: number;
  image: string;
  troops: number;
  territories: number;
  cards: number;
}

function App() {
  const { set_ip } = useElementStore((state) => state);
  const contractState = useComponentStates();

  const [players, setPlayers] = useState<Player[]>([]);

  const { ip, error, loading } = useIP();
  useEffect(() => {
    if (!loading && ip) {
      set_ip(ip);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ip, loading]);

  useEffect(() => {
    const adaptedPlayers = contractState.players.map((player, index) => ({
      address: player.address,
      name:
        Number(player.name) < 10
          ? `Bot_${player.name}`
          : `${shortString.decodeShortString(player.name)}`,
      supply: player.supply,
      image: persoImage,
      troops: 0,
      territories: 0,
      cards: 0,
      color: colorPlayer[index + 1],
    }));
    setPlayers(adaptedPlayers);
  }, [contractState.players]);

  const {
    setup: {
      systemCalls: { create },
      network: { graphSdk },
    },
    account: { account },
  } = useDojo();

  const handleRegionClick = (region: string) => {
    alert(`Vous avez cliqué sur la ${region}`);
    console.log(contractState.players);
    console.log(contractState.tiles);
  };

  const handleClick = () => {
    console.log(contractState.players[0]);
    console.log(contractState.players);
  };

  return (
    <>
      <NewGame />
      <button onClick={handleClick}>Afficher l'état du contrat</button>
      <Map handleRegionClick={handleRegionClick} />
      <div className="absolute top-32 right-0">
        {/* <div className="flex flex-col"> */}
        {players.map((player, index) => (
          <SidePlayerInfo
            key={index}
            name={player.name}
            image={player.image}
            color={player.color}
            troops={player.troops}
            territories={player.territories}
            cards={player.cards}
          />
        ))}
        {/* </div> */}
      </div>
      <div className="flex justify-center">
        <PlayPanel currentStateProp={1} />
      </div>
    </>
  );
}

export default App;
