import { useState } from 'react';
import { Burner } from 'create-burner-forked';
import { KATANA_ETH_CONTRACT_ADDRESS } from '@dojoengine/core';
import Balance from './Balance';
import { Button } from './ui/button';
import { shortAddress } from '@/utils/sanitizer';
import { useDojo } from '@/dojo/useDojo';
import { Trash } from 'lucide-react';

interface BurnerDetailsProps {
  burner: Burner;
  index: number;
  removeBurner: () => Promise<void>;
}

const BurnerDetails = ({ burner, index, removeBurner }: BurnerDetailsProps) => {
  const {
    burnerManager: { account, select },
  } = useDojo();

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await removeBurner();
    } catch (error) {
      console.error('Error removing burner:', error);
    }
    setIsLoading(false);
  };

  const handleSelect = async () => {
    //setIsLoading(true);
    try {
      select(burner.address);
    } catch (error) {
      console.error('Error selecting burner:', error);
    }
    //setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-between gap-3 vt323-font">
      <div
        className={`flex-grow flex items-center gap-3 rounded-lg px-3 py-1 justify-between ${
          account?.address === burner.address ? 'bg-green-500' : 'bg-gray-400'
        } text-primary-foreground drop-shadow-lg h-[32px]`}
      >
        <div className="font-joystix text-xs">{shortAddress(burner.address, 15)}</div>
        <Balance address={burner.address} token_address={KATANA_ETH_CONTRACT_ADDRESS} />
      </div>

      <div className="flex items-center gap-3 h-[32px]">
        <Button variant="tertiary" onClick={handleSelect} className="h-full p-0 px-3">
          Select
        </Button>
        <Button variant="destructive" className="h-full p-0 w-[40px]" onClick={handleDelete} disabled={isLoading}>
          {isLoading ? (
            <div>
              <span className="inline-block animate-jump delay-100">.</span>
              <span className="inline-block animate-jump delay-200">.</span>
              <span className="inline-block animate-jump delay-300">.</span>
            </div>
          ) : (
            <Trash size={16} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default BurnerDetails;
