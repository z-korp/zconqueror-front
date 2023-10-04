import { useEffect, useState } from 'react';
import './App.css';
import { useDojo } from './DojoContext';
import NewGame from './components/NewGame';
import Map from './components/map/map';
import PlayPanel from './components/playPanel';
import { useComponentStates } from './hooks/useComponentState';
import useIP from './hooks/useIp';
import { useElementStore } from './utils/store';
import SidePlayerInfo from './components/sidePlayerInfo';
import persoImage from './assets/perso.png';

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
    const adaptedPlayers = contractState.players.map((player) => ({
      address: player.address,
      name: player.name,
      supply: player.supply,
      image: persoImage,
      troops: 0,
      territories: 0,
      cards: 0,
      color: 'blue',
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
    console.log(contractState);
  };

  const handleClick = () => {
    console.log(contractState.players[0]);
    console.log(players);
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
