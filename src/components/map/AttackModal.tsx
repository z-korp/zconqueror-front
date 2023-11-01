import { useDojo } from '@/DojoContext';
import { useElementStore } from '@/utils/store';
import { getComponentEntities, getComponentValue } from '@latticexyz/recs';
import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Slider } from '../ui/slider';
import { defaultFieldResolver } from 'graphql';

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
    let tileRetrived = [...tilesEntities].map((id) => getComponentValue(Tile, id)) as any[];
    setTileRetrived(tileRetrived);
  }, [open]);

  useEffect(() => {
    if (attacker === null || defender === null) return;
    setAttackerTile(tileRetrived[attacker - 1]);
    setDefenderTile(tileRetrived[defender - 1]);
  }, [tileRetrived, attacker, defender, open]);

  const handleAttack = () => {
    console.log(attacker);
    if (attacker === null || defender === null) return;

    console.log(attackerTile);
    console.log(defenderTile);

    console.log('Troops', troopsToDispatch);
    if (!ip) return;

    // todo adapt to compare to attacker.supply
    if (player && player.attack < troopsToDispatch) {
      //todo put toast here
      alert('Not enough attack');
      return;
    }

    attack(account, ip.toString(), attacker, defender, troopsToDispatch);
  };

  const handleDefend = () => {
    if (!ip) return;
    if (!defender) return;
    if (!attacker) return;
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
            <Slider
              min={0}
              step={1}
              max={attackerTile ? attackerTile.army - 1 : 0}
              value={[troopsToDispatch]}
              onValueChange={(values: number[]) => setTroopsToDispatch(values[0])}
            />
            <Button onClick={handleAttack} className="mr-3">
              Send troups
            </Button>
            <Button onClick={handleDefend}> Resolve battle</Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AttackModal;
