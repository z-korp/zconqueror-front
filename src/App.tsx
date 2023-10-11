import { useEffect, useState } from 'react';
import './App.css';
import { useDojo } from './DojoContext';
import persoImage from './assets/perso.png';
import NewGame from './components/NewGame';
import PlayPanel from './components/PlayPanel';
import SidePlayerInfo from './components/SidePlayerInfo';
import Map from './components/map/Map';
import { useComponentStates } from './hooks/useComponentState';
import useIP from './hooks/useIp';
import { colorPlayer } from './utils/colors';
import { useElementStore } from './utils/store';
import { Player } from './utils/types';

function App() {
  const { set_ip } = useElementStore((state) => state);
  const contractState = useComponentStates();

  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const { ip, error, loading } = useIP();
  useEffect(() => {
    if (!loading && ip) {
      set_ip(ip);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ip, loading]);

  useEffect(() => {
    console.log(contractState.players, 'contractState.players');
    const adaptedPlayers = contractState.players.map((player, index) => ({
      address: player.address,
      name: Number(player.name) < 10 ? `Bot_${player.name}` : `${player.name}`,
      supply: player.supply,
      image: persoImage,
      troops: 0,
      territories: 0,
      cards: 0,
      color: colorPlayer[index + 1],
    }));
    setPlayers(adaptedPlayers);

    const playerWithNonZeroSupply = adaptedPlayers.find(
      (player) => player.supply !== 0
    );
    if (playerWithNonZeroSupply) {
      setCurrentPlayer(playerWithNonZeroSupply);
      console.log(
        `Player with non-zero supply: ${playerWithNonZeroSupply.name}`
      );
    }
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

  return (
    <>
      <NewGame />
      <Map handleRegionClick={handleRegionClick} />
      <div className="absolute top-32 right-0">
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
      </div>
      <div className="flex justify-center">
        {currentPlayer && (
          <PlayPanel currentStateProp={1} currentPlayer={currentPlayer} />
        )}
      </div>
    </>
  );
}

export default App;
