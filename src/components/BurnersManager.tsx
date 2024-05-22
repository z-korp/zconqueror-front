import BurnerDetails from './BurnerDetails';
import { useEffect, useState } from 'react';
import { useDojo } from '../dojo/useDojo';
import { useNetwork } from '@starknet-react/core';
import { Button } from './ui/Button';
import { ClipboardPaste, Save } from 'lucide-react';

const BurnersManager = () => {
  const { chain } = useNetwork();
  const {
    burnerManager: { applyFromClipboard, list, create, clear, remove, copyToClipboard, isDeploying },
  } = useDojo();

  const [clipboardStatus, setClipboardStatus] = useState({
    message: '',
    isError: false,
  });

  const handleRestoreBurners = async () => {
    try {
      await applyFromClipboard();
      setClipboardStatus({
        message: 'Burners restored successfully!',
        isError: false,
      });
    } catch (error) {
      setClipboardStatus({
        message: `Failed to restore burners from clipboard`,
        isError: true,
      });
    }
  };

  useEffect(() => {
    if (clipboardStatus.message) {
      const timer = setTimeout(() => {
        setClipboardStatus({ message: '', isError: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [clipboardStatus.message]);

  return (
    <div className="flex flex-col gap-4 vt323-font">
      <h2 className="m-0 text-2xl">Burners</h2>
      <div className="flex flex-col gap-3">
        {list().map((burner, i) => (
          <BurnerDetails
            key={burner.address}
            burner={burner}
            removeBurner={async () =>
              remove(burner.address, {
                maxFee: '5000000000000000', // 0.005 ETH
              })
            }
            index={i}
          />
        ))}
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="flex gap-3 justify-between">
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
                  maxFee: '5000000000000000', // 0.005 ETH
                },
              })
            }
          >
            {isDeploying ? 'Deploying burner...' : 'Create burner'}
          </Button>

          {list().length > 0 && (
            <Button className="flex gap-3 h-fit" variant="tertiary" onClick={async () => await copyToClipboard()}>
              <Save size={16} />
              <p>Save Burners to Clipboard</p>
            </Button>
          )}
          <Button className="flex gap-3 h-fit" variant="tertiary" onClick={handleRestoreBurners}>
            <ClipboardPaste size={16} />
            <p>Restore Burners from Clipboard</p>
          </Button>
          {clipboardStatus.message && (
            <div className={clipboardStatus.isError ? 'error' : 'success'}>{clipboardStatus.message}</div>
          )}

          <Button
            className="h-fit"
            variant="destructive"
            onClick={() =>
              clear({
                maxFee: '1000000000000000', // 0.001 ETH
              })
            }
          >
            Clear burners
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BurnersManager;
