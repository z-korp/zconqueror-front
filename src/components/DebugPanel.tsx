import { IoMdClose } from 'react-icons/io';
import Burners from './Burners';
import { useElementStore } from '@/utils/store';
import '../../src/styles/debugPanel.css';

export const DebugPanel = () => {
  const { isWalletPanelOpen, setWalletPanelOpen } = useElementStore((state) => state);

  return (
    <>
      <div className={`side-panel ${isWalletPanelOpen ? 'open' : ''} z-31`}>
        <div className="side-panel-element">
          <button className="btn-close" onClick={() => setWalletPanelOpen(!isWalletPanelOpen)}>
            <IoMdClose size="2em" />
          </button>
        </div>
        <Burners />
      </div>
    </>
  );
};
