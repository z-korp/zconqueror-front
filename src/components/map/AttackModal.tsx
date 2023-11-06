import { useDojo } from '@/DojoContext';
import { useElementStore } from '@/utils/store';
import { getComponentEntities, getComponentValue } from '@latticexyz/recs';
import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Slider } from '../ui/slider';

interface AttackModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  attacker: number | null;
  defender: number | null;
  player: any;
}

const AttackModal: React.FC<AttackModalProps> = ({ open, onClose, attacker, defender, player }) => {
  const {
    setup: {
      components: { Player, Tile },
      systemCalls: { attack, defend },
    },
    account: { account },
  } = useDojo();

  const { ip } = useElementStore((state) => state);
  const [troopsToDispatch, setTroopsToDispatch] = React.useState(0);

  const [tileRetrived, setTileRetrived]: any[] = React.useState([]);
  const [attackerTile, setAttackerTile]: any = React.useState(null);
  const [defenderTile, setDefenderTile]: any = React.useState(null);

  // we might here get only two tiles and not all of them

  useEffect(() => {
    const tilesEntities = getComponentEntities(Tile);
    const tileRetrived = [...tilesEntities].map((id) => getComponentValue(Tile, id)) as any[];
    setTileRetrived(tileRetrived);
  }, [open]);

  useEffect(() => {
    if (attacker === null || defender === null) return;
    setAttackerTile(tileRetrived[attacker - 1]);
    setDefenderTile(tileRetrived[defender - 1]);
  }, [tileRetrived, attacker, defender, open]);

  const handleAttack = async () => {
    console.log('attacker', attacker);
    console.log('defender', defender);
    if (attacker === null || defender === null) return;

    console.log('attackerTile', attackerTile);
    console.log('defenderTile', defenderTile);

    console.log('Troops', troopsToDispatch);
    if (!ip) return;

    // todo adapt to compare to attacker.supply
    if (player && player.attack < troopsToDispatch) {
      //todo put toast here
      alert('Not enough attack');
      return;
    }

    await attack(account, ip.toString(), attacker, defender, troopsToDispatch);
    defend(account, ip.toString(), attacker, defender);
    onClose(false);
  };

  if (!player) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attack {attacker}</DialogTitle>
          <DialogDescription>
            <div> Defender {defender}</div>
            <div className="flex gap-2 items-center">
              <Slider
                className="mt-4 mb-0"
                min={0}
                step={1}
                max={attackerTile ? attackerTile.army - 1 : 0}
                value={[troopsToDispatch]}
                onValueChange={(values: number[]) => setTroopsToDispatch(values[0])}
              />
              <Button onClick={handleAttack} className="w-44">
                Attack
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AttackModal;
