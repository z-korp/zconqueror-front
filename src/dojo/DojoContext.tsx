import { BurnerAccount, useBurnerManager } from '@dojoengine/create-burner';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import { Account } from 'starknet';
import { SetupResult } from './setup';

interface DojoContextType extends SetupResult {
  masterAccount: Account;
  account: BurnerAccount;
}

export const DojoContext = createContext<DojoContextType | null>(null);

type Props = {
  children: ReactNode;
  value: SetupResult;
};

export const DojoProvider = ({ children, value }: Props) => {
  const currentValue = useContext(DojoContext);
  if (currentValue) throw new Error('DojoProvider can only be used once');

  const {
    config: { masterAddress, masterPrivateKey },
    burnerManager,
    dojoProvider,
  } = value;

  const masterAccount = useMemo(
    () => new Account(dojoProvider.provider, masterAddress, masterPrivateKey, '1'),
    [masterAddress, masterPrivateKey, dojoProvider.provider]
  );

  const {
    create,
    list,
    get,
    account,
    select,
    isDeploying,
    clear,
    copyToClipboard,
    applyFromClipboard,
    remove,
    deselect,
    count,
  } = useBurnerManager({
    burnerManager,
  });

  return (
    <DojoContext.Provider
      value={{
        ...value,
        masterAccount,
        account: {
          create,
          list,
          get,
          select,
          clear,
          account: account ? account : masterAccount,
          isDeploying,
          copyToClipboard,
          applyFromClipboard,
          remove,
          deselect,
          count,
        },
      }}
    >
      {children}
    </DojoContext.Provider>
  );
};
