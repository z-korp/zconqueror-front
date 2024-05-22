import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useDojo } from '@/dojo/useDojo';
import '../../src/styles/debugPanel.css';
import { shortAddress } from '@/utils/sanitizer';
import { Wallet } from 'lucide-react';
import BurnersManager from './BurnersManager';
import { Button } from './ui/button';
import MasterAccountConnect from './MasterAccountConnect';

export const DebugPanel = () => {
  const {
    burnerManager: { account },
  } = useDojo();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-end gap-2 pr-2 z-0">
        <Button className="p-2 flex gap-3" variant="tertiary" onClick={() => setIsOpen(!isOpen)}>
          <Wallet size={16} />{' '}
          <p className="vt323-font">{account?.address ? shortAddress(account?.address) : 'Connect'}</p>
        </Button>
      </div>

      <div className={`side-panel ${isOpen ? 'open' : ''} z-31`}>
        <div className="side-panel-element">
          <button className="btn-close" onClick={() => setIsOpen(!isOpen)}>
            <IoMdClose size="2em" />
          </button>
        </div>
        <MasterAccountConnect />
        <div className="h-10" />
        <BurnersManager />
      </div>
    </>
  );
};
