import { useState } from 'react';
import { IoIosSettings, IoMdClose } from 'react-icons/io';
import Burners from './Burners';
import { useDojo } from '@/dojo/useDojo';
import '../../src/styles/debugPanel.css';

export const DebugPanel = () => {
  const {
    account: { account },
  } = useDojo();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="w-screen flex items-center justify-between pr-2">
        <button onClick={() => setIsOpen(!isOpen)}>
          <IoIosSettings size="2em" />
        </button>
        <div>{account.address}</div>
      </div>

      <div className={`side-panel ${isOpen ? 'open' : ''}`}>
        <div className="side-panel-element">
          <button className="btn-close" onClick={() => setIsOpen(!isOpen)}>
            <IoMdClose size="2em" />
          </button>
        </div>
        <Burners />
      </div>
    </>
  );
};
