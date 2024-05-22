import { useAccount, useNetwork } from '@starknet-react/core';
import MasterAccountConnect from './MasterAccountConnect';
import { useDojo } from '@/dojo/useDojo';
import { Button } from './ui/button';

const OverlayConnection = () => {
  const { chain } = useNetwork();
  const { account: masterAccount } = useAccount();

  const { burnerManager } = useDojo();
  const { account: dojoAccount, isDeploying, create } = burnerManager;

  if (dojoAccount) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-[1000]"
      style={{
        background: 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)',
      }}
    >
      <div className="relative flex flex-col items-center w-4/5 h-[350px] rounded-lg border-2 border-stone-900 p-16 z-[1001] vt323-font bg-stone-600 text-white justify-center">
        {!masterAccount && <p className="text-xl mb-2">Connect your StarkNet wallet to get started.</p>}
        <MasterAccountConnect />
        <div className="h-10" />
        {masterAccount && (
          <>
            <p className="text-xl mb-2">
              {`Create a burner wallet to play the game without manually signing each transaction. The burner wallet will
              be prefunded with ${chain.network === 'katana' ? 'O.4 ETH' : '0.01 ETH'}.`}
            </p>
            <Button
              className="h-fit"
              variant="tertiary"
              onClick={() =>
                create({
                  prefundedAmount:
                    chain.network === 'katana'
                      ? '400000000000000000' // 0.4 ETH
                      : '10000000000000000', // 0.01 ETH
                  transactionDetails: {
                    maxFee: '1000000000000000', // 0.001 ETH
                  },
                })
              }
            >
              {isDeploying ? 'Deploying burner...' : 'Create burner'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default OverlayConnection;
