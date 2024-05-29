import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import '../../src/styles/debugPanel.css';
import { shortAddress } from '@/utils/sanitizer';
import { Wallet } from 'lucide-react';
import { Button } from './ui/button';
import { useAccount } from '@starknet-react/core';
import Connect from './Connect';

export const DebugPanel = () => {
  const { account } = useAccount();

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
        <Connect />
      </div>
    </>
  );
};
