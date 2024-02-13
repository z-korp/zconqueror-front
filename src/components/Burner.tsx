import { useElementStore } from '@/utils/store';
import React from 'react';
import { Button } from './ui/button';
import { useDojo } from '@/dojo/useDojo';

const Burner: React.FC = () => {
  const {
    account: { create, list, select, isDeploying, clear },
  } = useDojo();

  const { current_address, set_current_address } = useElementStore((state) => state);

  const handleCreate = () => {
    create();
  };

  const handleSelectWallet = (walletAddress: string) => {
    set_current_address(walletAddress);
    current_address && select(current_address);
    select(walletAddress);
  };

  return (
    <div className="flex justify-center p-4">
      <div className="flex flex-col items-start gap-2">
        <h3 className="font-bold text-start">Wallets:</h3>
        <ul className="flex flex-col gap-1">
          {list().map((wallet) => (
            <li key={wallet.address}>
              <button
                className={`${
                  current_address === wallet.address ? 'bg-green-500' : 'bg-gray-300'
                } hover:bg-green-700 text-white font-bold py-2 px-4 rounded min-w-[670px]`}
                onClick={() => handleSelectWallet(wallet.address)}
              >
                {wallet.address}
              </button>
            </li>
          ))}
        </ul>
        <Button className="self-end" onClick={handleCreate}>
          {isDeploying ? 'Deploying...' : 'Create burner'}
        </Button>
        <Button onClick={() => clear()}>Clear burners</Button>
      </div>
    </div>
  );
};

export default Burner;
