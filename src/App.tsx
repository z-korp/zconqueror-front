import { useEffect } from 'react';
import './App.css';
import { useDojo } from './DojoContext';
import NewGame from './components/NewGame';
import Map from './components/map/map';
import PlayPanel from './components/playPanel';
import { useComponentStates } from './hooks/useComponentState';
import useIP from './hooks/useIp';
import { useElementStore } from './utils/store';

function App() {
  const { set_ip } = useElementStore((state) => state);
  const { ip, error, loading } = useIP();
  useEffect(() => {
    if (!loading && ip) {
      set_ip(ip);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ip, loading]);

  const contractState = useComponentStates();

  const {
    setup: {
      systemCalls: { create },
      network: { graphSdk },
    },
    account: { account },
  } = useDojo();

  const handleRegionClick = (region: string) => {
    alert(`Vous avez cliqué sur la ${region}`);
  };

  return (
    <>
      <NewGame />
      <Map handleRegionClick={handleRegionClick} />
      <div className="flex justify-center">
        <PlayPanel currentStateProp={1} />
      </div>
    </>
  );
}

export default App;
