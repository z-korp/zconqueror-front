import { useDojo } from '@/DojoContext';
import { useElementStore } from '@/utils/store';
import React from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Slider } from '../ui/slider';

interface SupplyModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  regionId: number | null;
  player: any;
}

const SupplyModal: React.FC<SupplyModalProps> = ({
  open,
  onClose,
  player,
  regionId,
}) => {
  const {
    setup: {
      components: { Player },
      systemCalls: { supply },
    },
    account: { account },
  } = useDojo();

  const { ip } = useElementStore((state) => state);
  const [troopsToDeploy, setTroopsToDeploy] = React.useState(0);

  const handleSupply = () => {
    console.log(player.supply, troopsToDeploy);
    if (!ip) return;
    if (regionId === null) return;
    if (player && player.supply < troopsToDeploy) {
      //todo put toast here
      alert('Not enough supply');
      return;
    }
    supply(account, ip.toString(), regionId, troopsToDeploy);
    onClose(false);
  };

  if (!player) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Region {regionId}</DialogTitle>
          <DialogDescription>
            <Slider
              min={0}
              step={1}
              max={player.supply}
              value={[troopsToDeploy]}
              onValueChange={(values: number[]) => setTroopsToDeploy(values[0])}
            />
            <Button onClick={handleSupply}>Deploy troups</Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SupplyModal;
