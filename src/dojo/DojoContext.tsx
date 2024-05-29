import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { AccountInterface } from 'starknet';
import { SetupResult } from './setup';
import { useAccount } from '@starknet-react/core';

interface DojoContextType extends SetupResult {
  masterAccount: AccountInterface | undefined;
}

export const DojoContext = createContext<DojoContextType | null>(null);

export const DojoProvider = ({ children, value }: { children: ReactNode; value: SetupResult }) => {
  const currentValue = useContext(DojoContext);
  if (currentValue) throw new Error('DojoProvider can only be used once');

  const { account: masterAccount } = useAccount();

  return (
    <DojoContext.Provider
      value={{
        ...value,
        masterAccount,
      }}
    >
      {children}
    </DojoContext.Provider>
  );
};
