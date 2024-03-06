import { useGetCurrentPlayer } from '@/hooks/useGetCurrentPlayer';
import { useGetTiles } from '@/hooks/useGetTiles';
import { usePhase } from '@/hooks/usePhase';
import { Phase, useElementStore } from '@/utils/store';
import { Milestone, ShieldPlus, Swords } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Slider } from './ui/slider';
import { useDojo } from '@/dojo/useDojo';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { BATTLE_EVENT } from '@/constants';
import { parseBattleEvent } from '@/utils/events';
import { useGetPlayers } from '@/hooks/useGetPlayers';
import { Battle, BattleEvent } from '@/utils/types';
import { sleep } from '@/utils/time';
import { getBattleFromBattleEvents } from '@/utils/battle';
import OverlayBattle from './BattleReport/OverlayBattle';

const ActionPanel = () => {
  const {
    setup: {
      client: { play },
    },
    account: { account },
  } = useDojo();

  const {
    current_source,
    set_current_source,
    current_target,
    set_current_target,
    game_id,
    set_army_count,
    army_count,
  } = useElementStore((state) => state);

  const { phase } = usePhase();
  const { players } = useGetPlayers();
  const { currentPlayer } = useGetCurrentPlayer();
  const [sourceTile, setSourceTile] = useState<any | null>(null);
  const [targetTile, setTargetTile] = useState<any | null>(null);
  const [isActionSelected, setIsActionSelected] = useState(false);
  const [isDiceAnimation, setIsDiceAnimation] = useState(false);
  const [battle, setBattle] = useState<Battle | null>(null);

  useEffect(() => {
    set_army_count(0);
    set_current_source(null);
    set_current_target(null);
  }, [phase]);

  const { tiles } = useGetTiles();

  useEffect(() => {
    if (current_source !== null) {
      const sourceTileData = tiles[current_source - 1];
      setSourceTile(sourceTileData);
      if (sourceTileData && sourceTileData.army) {
        if (phase === Phase.DEPLOY) {
          set_army_count(currentPlayer.supply);
        } else {
          set_army_count(sourceTileData.army - 1);
        }
      }
      setIsActionSelected(true);
    } else {
      setSourceTile(null);
      setIsActionSelected(false);
    }

    if (current_target !== null) {
      const targetTileData = tiles[current_target - 1];
      setTargetTile(targetTileData);
    } else {
      setTargetTile(null);
    }
  }, [current_source, current_target, phase]);

  const handleSupply = async () => {
    if (game_id == null || game_id == undefined) return;
    if (current_source === null) return;
    if (currentPlayer && currentPlayer.supply < army_count) {
      // todo put toast here
      console.log('Not enough supply', currentPlayer.supply, army_count);
      return;
    }

    await play.supply(account, game_id, current_source, army_count);
    removeSelected();
  };

  const handleAttack = async () => {
    if (current_source === null || current_target === null) return;

    if (game_id == null || game_id == undefined) return;

    // todo adapt to compare to source.supply
    if (currentPlayer && currentPlayer.attack < army_count) {
      //todo put toast here
      alert('Not enough attack');
      return;
    }

    try {
      const attackerTroups = tiles[current_source - 1].army - 1;
      const defenderTroups = tiles[current_target - 1].army;

      await play.attack(account, game_id, current_source, current_target, army_count);
      setIsDiceAnimation(true);

      await sleep(100);
      const ret = await play.defend(account, game_id, current_source, current_target);

      console.log('---------');
      console.log(attackerTroups, defenderTroups);
      console.log('qqqqq', ret.events);
      const battleEvents: BattleEvent[] = ret.events
        .filter((e) => e.keys[0] === BATTLE_EVENT)
        .map((event) => parseBattleEvent(event));
      console.log('qqqqq', battleEvents);

      const attackerName = players[battleEvents[0].attackerIndex].name;
      const defenderName = players[battleEvents[0].defenderIndex].name;
      const battle = getBattleFromBattleEvents(
        battleEvents,
        attackerName,
        attackerTroups,
        defenderName,
        defenderTroups
      );
      console.log('======> ATTACK', battle);
      setBattle(battle);
      /*const battle: Duel[] = [];
      await fetchEventsOnce([BATTLE_EVENT, '0x' + game_id.toString(16), '0x' + game.nonce.toString(16)], (event) =>
        battle.push(parseBattleEvent(event))
      );
      console.log('qqqqq', groupDuelsByBattleId(battle));*/

      removeSelected();

      await sleep(5000);
      setIsDiceAnimation(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{error.message}</code>,
      });
    }
  };

  const handleMoveTroops = async () => {
    if (current_source === null || current_target === null) return;

    if (game_id == null || game_id == undefined) return;

    await play.transfer(account, game_id, current_source, current_target, army_count);
    removeSelected();
  };

  const removeSelected = (): void => {
    set_current_source(null);
    set_current_target(null);
  };

  const isAttackTurn = () => {
    return phase === Phase.ATTACK;
  };

  const isFortifyTurn = () => {
    return phase === Phase.FORTIFY;
  };

  const handleCloseDice = () => {
    setIsDiceAnimation(false);
  };

  const handleCloseAttackReport = () => {
    setBattle(null);
  };

  return (
    <>
      {/*isDiceAnimation && <OverlayDice onClose={handleCloseDice} />*/}
      {battle && <OverlayBattle battle={battle} onClose={handleCloseAttackReport} />}
      {isAttackTurn() ? (
        current_source &&
        current_target &&
        sourceTile.army > 1 && (
          <div
            id="parent"
            className={`flex items-center justify-around p-4 h-28 ${
              isActionSelected &&
              'border-2 rounded-lg border-primary bg-black bg-opacity-30 backdrop-blur-md drop-shadow-lg '
            } `}
          >
            {sourceTile.army > 2 && (
              <Slider
                className="w-32"
                min={1}
                max={sourceTile ? sourceTile.army - 1 : Infinity}
                value={[army_count]}
                onValueChange={(newValue: number[]) => {
                  set_army_count(newValue[0]);
                }}
                color="red"
              ></Slider>
            )}
            <>
              <Button
                onClick={handleAttack}
                className="flex items-center justify-center h-10 px-2 text-white bg-red-500 rounded hover:bg-red-600 drop-shadow-lg hover:transform hover:-translate-y-1 transition-transform ease-in-out"
              >
                ATTACK <Swords className="ml-2" />
              </Button>
              <Button
                onClick={removeSelected}
                className="absolute top-1 right-1 flex items-center justify-center p-1 w-[22px] h-[22px] bg-red-500 text-white rounded-full text-xs"
              >
                ✕
              </Button>
            </>
          </div>
        )
      ) : isFortifyTurn() ? (
        <>
          {currentPlayer && targetTile && current_source && sourceTile && sourceTile.army > 1 && current_target && (
            <div
              id="parent"
              className={`flex items-center justify-around p-4 h-28 ${
                isActionSelected &&
                'border-2 rounded-lg border-primary bg-black bg-opacity-30 backdrop-blur-md drop-shadow-lg'
              } `}
            >
              <Slider
                className="w-32"
                min={1}
                max={sourceTile.army - 1}
                value={[army_count]}
                onValueChange={(newValue: number[]) => {
                  set_army_count(newValue[0]);
                }}
              ></Slider>
              <Button
                onClick={handleMoveTroops}
                className="flex items-center justify-center h-10 px-2 text-white bg-green-500 rounded hover:bg-green-600 drop-shadow-lg hover:transform hover:-translate-y-1 transition-transform ease-in-out"
              >
                MOVE
                <Milestone className="ml-2" />
              </Button>
              <Button
                onClick={removeSelected}
                className="absolute top-1 right-1 flex items-center p-1 justify-center w-[22px] h-[22px] bg-red-500 text-white rounded-full text-xs"
              >
                ✕
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          {currentPlayer && sourceTile && current_source && currentPlayer.supply > 0 && (
            <div
              id="parent"
              className={`flex items-center justify-around p-4 h-28 ${
                isActionSelected &&
                'border-2 rounded-lg border-primary bg-black bg-opacity-30 backdrop-blur-md drop-shadow-lg'
              } `}
            >
              <Slider
                className="w-32"
                min={1}
                max={currentPlayer.supply}
                value={[army_count]}
                onValueChange={(newValue: number[]) => {
                  set_army_count(newValue[0]);
                }}
              ></Slider>
              <Button
                onClick={handleSupply}
                className="flex items-center justify-center h-10 px-2 text-white bg-green-500 rounded hover:bg-green-600 drop-shadow-lg hover:transform hover:-translate-y-1 transition-transform ease-in-out"
              >
                DEPLOY <ShieldPlus className="ml-2" />
              </Button>
              <Button
                onClick={removeSelected}
                className="absolute top-1 right-1 flex items-center p-1 justify-center w-[22px] h-[22px] bg-red-500 text-white rounded-full text-xs"
              >
                ✕
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};
export default ActionPanel;
