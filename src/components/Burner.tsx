// BurnerActions.tsx
import React, { useEffect, useState } from 'react';
import { useDojo } from '@/DojoContext';

const Burner: React.FC = () => {
  const {
    account: { create, list, select, account, isDeploying },
  } = useDojo();

  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  useEffect(() => {
    console.log('isDeploying', isDeploying);
    console.log('account', account);
    console.log('list', list());
  }, [isDeploying]);
  const handleCreate = () => {
    console.log('create');
    create();
    console.log('get list');
    const array = list();
    console.log(isDeploying);
  };

  const handleSelectWallet = (walletAddress: string) => {
    setSelectedWallet(walletAddress);
    select(walletAddress);
  };

  return (
    <div className="p-4">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleCreate}>
        Créer
      </button>
      <div>
        <h3>Wallets:</h3>
        <ul>
          {list().map((wallet) => (
            <li key={wallet.address}>
              <button
                className={`${
                  selectedWallet === wallet.address ? 'bg-green-500' : 'bg-gray-300'
                } hover:bg-green-700 text-white font-bold py-2 px-4 rounded`}
                onClick={() => handleSelectWallet(wallet.address)}
              >
                {wallet.address}
              </button>
            </li>
          ))}
        </ul>

        <>
          <button onClick={create}>{isDeploying ? 'deploying burner' : 'create burner'}</button>
          <div className="card">
            select signer:{' '}
            <select onChange={(e) => select(e.target.value)}>
              {list().map((account, index) => {
                return (
                  <option value={account.address} key={index}>
                    {account.address}
                  </option>
                );
              })}
            </select>
            <p>account: {account.address}</p>
          </div>
        </>
      </div>
    </div>
  );
};

export default Burner;
