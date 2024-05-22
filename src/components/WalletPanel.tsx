import { IoMdClose } from 'react-icons/io';
import BurnersManager from './BurnersManager';
import MasterAccountConnect from './MasterAccountConnect';
import { useElementStore } from '@/utils/store';
import '../../src/styles/debugPanel.css';

export const WalletPanel = () => {
  const { isWalletPanelOpen, setWalletPanelOpen } = useElementStore((state) => state);
  return (
    <div className={`side-panel ${isWalletPanelOpen ? 'open' : ''} z-31`}>
      <div className="side-panel-element">
        <button className="btn-close" onClick={() => setWalletPanelOpen(!isWalletPanelOpen)}>
          <IoMdClose size="2em" />
        </button>
      </div>
      <MasterAccountConnect />
      <div className="h-10" />
      <BurnersManager />
    </div>
  );
};
