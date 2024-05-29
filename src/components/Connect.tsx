import { useConnect, useAccount, useDisconnect } from '@starknet-react/core';
import { KATANA_ETH_CONTRACT_ADDRESS } from '@dojoengine/core';
import Balance from './Balance';
import { Button } from './ui/button';
import { shortAddress } from '@/utils/sanitizer';
import { Copy } from 'lucide-react';
import { toast } from './ui/use-toast';

const Connect = () => {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, status } = useAccount();

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard
        .writeText(address)
        .then(() => {
          toast({ description: 'Address copied to clipboard' });
        })
        .catch((err) => {
          console.error('Failed to copy the address: ', err);
        });
    }
  };

  if (status === 'connected' && address) {
    return (
      <div className="flex gap-3 items-center flex-col w-full vt323-font">
        <h2 className="m-0 text-2xl">Account</h2>
        <div className="flex items-center gap-3 w-full">
          <div className="flex-grow flex items-center gap-3 rounded-lg px-3 py-1 justify-between bg-gray-400 text-primary-foreground drop-shadow-lg h-[32px] box-border">
            <p className="font-joystix text-xs">{shortAddress(address, 15)}</p>
            <Balance address={address} token_address={KATANA_ETH_CONTRACT_ADDRESS} />
          </div>
          <Button className="h-[32px]" variant="tertiary" onClick={copyToClipboard}>
            <Copy size={16} />
          </Button>
          <Button className="h-[32px]" variant="destructive" onClick={() => disconnect()}>
            Disconnect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 vt323-font">
      {connectors.map((connector) => (
        <span key={connector.id}>
          <Button
            variant="tertiary"
            onClick={() => {
              connect({ connector });
            }}
          >
            Connect
          </Button>
        </span>
      ))}
    </div>
  );
};

export default Connect;
