import { shortAddress } from '@/utils/sanitizer';
import { Wallet } from 'lucide-react';
import { Button } from './ui/button';
import { useElementStore } from '@/utils/store';
import { useAccount } from '@starknet-react/core';

const WalletButton = () => {
  const { account } = useAccount();

  const { isWalletPanelOpen, setWalletPanelOpen } = useElementStore((state) => state);

  return (
    <Button className="p-2 flex gap-3" variant="tertiary" onClick={() => setWalletPanelOpen(!isWalletPanelOpen)}>
      <Wallet size={16} /> <p className="vt323-font">{account?.address ? shortAddress(account?.address) : 'Connect'}</p>
    </Button>
  );
};

export default WalletButton;
