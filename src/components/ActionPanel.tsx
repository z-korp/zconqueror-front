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
import { sleep } from '@/utils/time';
import OverlayBattle from './BattleReport/OverlayBattle';
import { uuid } from '@latticexyz/utils';
import { getBattleFromBattleEvents } from '@/utils/battle';
import { BattleEvent, parseBattleEvent } from '@/utils/events';
import { Battle } from '@/utils/types';
import { BATTLE_EVENT } from '@/constants';
import { Entity } from '@/graphql/generated/graphql';

const SLEEP_TIME = 600; // ms

const ovIdSource = uuid();
const ovIdTarget = uuid();

const ActionPanel = () => {
  const {
    setup: {
      client: { play },
      clientComponents: { Tile },
    },
    account: { account },
  } = useDojo();

  const {
    current_source,
    set_current_source,
    current_target,
    set_current_target,
    game_id,
    lastBattleResult,
    setLastBattleResult,
  } = useElementStore((state) => state);

  const { phase } = usePhase();
  const { currentPlayer } = useGetCurrentPlayer();
  const [sourceTile, setSourceTile] = useState<any | null>(null);
  const [targetTile, setTargetTile] = useState<any | null>(null);
  const [sourceEntity, setSourceEntity] = useState<Entity | null>(null);
  const [targetEntity, setTargetEntity] = useState<Entity | null>(null);
  const [isActionSelected, setIsActionSelected] = useState(false);
  const [battleResult, setBattleResult] = useState<Battle | null>(null);
  const [isBtnActionDisabled, setIsBtnActionDisabled] = useState(false);

  const [armySelected, setArmySelected] = useState(0);

  useEffect(() => {
    removeSelected();
  }, [phase]);

  const { tiles, tilesEntities } = useGetTiles();

  useEffect(() => {
    if (current_source !== null) {
      const tile = tiles[current_source - 1];
      setSourceTile(tile);
      setSourceEntity(tilesEntities[current_source - 1]);
      if (tile && tile.army) {
        if (phase === Phase.DEPLOY) {
          setArmySelected(currentPlayer.supply);
        } else {
          setArmySelected(tile.army - 1);
        }
      }
      setIsActionSelected(true);
    } else {
      setSourceTile(null);
      setSourceEntity(null);
      setIsActionSelected(false);
    }
  }, [current_source, phase]);

  useEffect(() => {
    if (current_target !== null) {
      const tile = tiles[current_target - 1];
      setTargetTile(tile);
      setTargetEntity(tilesEntities[current_target - 1]);
    } else {
      setTargetTile(null);
      setTargetEntity(null);
    }
  }, [current_target, phase]);

  useEffect(() => {
    if (sourceTile === null) return;
    Tile.removeOverride(ovIdSource);
    setSourceOverride();

    if (targetTile === null) return;
    let targetArmy = targetTile.army;
    if (phase === Phase.FORTIFY || phase === Phase.DEPLOY) {
      targetArmy = targetTile.army + armySelected;
    }
    Tile.addOverride(ovIdTarget, {
      entity: targetEntity,
      value: {
        army: targetArmy,
      },
    });
  }, [armySelected, targetTile, sourceTile]);

  function setSourceOverride() {
    let sourceArmy = sourceTile.army;
    if (phase === Phase.FORTIFY) {
      if (sourceTile !== null && targetTile !== null) {
        sourceArmy = sourceArmy - armySelected;
      } else {
        sourceArmy = sourceTile.army;
      }
    } else if (phase === Phase.DEPLOY) {
      sourceArmy = sourceArmy + armySelected;
    }

    Tile.addOverride(ovIdSource, {
      entity: sourceEntity,
      value: {
        army: sourceArmy,
      },
    });
  }

  const handleSupply = async () => {
    if (game_id == null || game_id == undefined) return;
    if (current_source === null) return;
    if (currentPlayer && currentPlayer.supply < armySelected) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">Not enough supply</code>,
      });
      return;
    }

    // Disable all the btn using tx call
    setIsBtnActionDisabled(true);

    try {
      await play.supply(account, game_id, current_source, armySelected);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{error.message}</code>,
      });
    } finally {
      await sleep(SLEEP_TIME); // otherwise value blink on tile
      Tile.removeOverride(ovIdSource);
      // Disable btn if there is an error to avoid stuck state
      setIsBtnActionDisabled(false);
    }

    removeSelected();
    // Tx is done enable btn
    setIsBtnActionDisabled(false);
  };

  const handleAttack = async () => {
    if (current_source === null || current_target === null) return;
    if (game_id == null || game_id == undefined) return;

    // todo adapt to compare to source.supply
    if (currentPlayer && currentPlayer.attack < armySelected) {
      //todo put toast here
      alert('Not enough attack');
      return;
    }

    // Disable all the btn using tx call
    setIsBtnActionDisabled(true);

    try {
      await play.attack(account, game_id, current_source, current_target, armySelected);

      await sleep(500);
      const ret = await play.defend(account, game_id, current_source, current_target);

      const battleEvents: BattleEvent[] = [];
      ret.events
        .filter((e) => e.keys[0] === BATTLE_EVENT)
        .forEach((event) => {
          const battleEvent = parseBattleEvent(event);
          battleEvents.push(battleEvent);
        });

      if (battleEvents.length !== 0) {
        const battle = getBattleFromBattleEvents(battleEvents);
        setBattleResult(battle);
      }

      removeSelected();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{error.message}</code>,
      });
    } finally {
      await sleep(SLEEP_TIME); // otherwise value blink on tile
      Tile.removeOverride(ovIdSource);
      Tile.removeOverride(ovIdTarget);
      // Disable btn if there is an error to avoid stuck state
      setIsBtnActionDisabled(false);
    }

    removeSelected();
    // Tx is done enable btn
    setIsBtnActionDisabled(false);
  };

  const handleMoveTroops = async () => {
    if (current_source === null || current_target === null) return;
    if (game_id == null || game_id == undefined) return;

    // Disable all the btn using tx call
    setIsBtnActionDisabled(true);

    try {
      await play.transfer(account, game_id, current_source, current_target, armySelected);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        description: <code className="text-white text-xs">{error.message}</code>,
      });
    } finally {
      await sleep(SLEEP_TIME); // otherwise value blink on tile
      Tile.removeOverride(ovIdSource);
      Tile.removeOverride(ovIdTarget);
      // Disable btn if there is an error to avoid stuck state
      setIsBtnActionDisabled(false);
    }

    removeSelected();
    // Tx is done enable btn
    setIsBtnActionDisabled(false);
  };

  const removeSelected = (): void => {
    set_current_source(null);
    set_current_target(null);
    setArmySelected(0);
  };

  const isAttackTurn = () => {
    return phase === Phase.ATTACK;
  };

  const isFortifyTurn = () => {
    return phase === Phase.FORTIFY;
  };

  return (
    <>
      {/*lastBattleResult && <OverlayBattle battle={lastBattleResult} onClose={handleCloseAttackReport} />*/}
      {battleResult && <OverlayBattle battle={battleResult} onClose={() => setBattleResult(null)} />}
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
                value={[armySelected]}
                onValueChange={(newValue: number[]) => {
                  setArmySelected(newValue[0]);
                }}
                color="red"
              ></Slider>
            )}
            <>
              <Button
                isLoading={isBtnActionDisabled}
                isDisabled={isBtnActionDisabled}
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
                value={[armySelected]}
                onValueChange={(newValue: number[]) => {
                  setArmySelected(newValue[0]);
                }}
              ></Slider>
              <Button
                isLoading={isBtnActionDisabled}
                isDisabled={isBtnActionDisabled}
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
              {currentPlayer.supply > 1 && (
                <Slider
                  className="w-32"
                  min={1}
                  max={currentPlayer.supply}
                  value={[armySelected]}
                  onValueChange={(newValue: number[]) => {
                    setArmySelected(newValue[0]);
                  }}
                ></Slider>
              )}
              <Button
                isLoading={isBtnActionDisabled}
                isDisabled={isBtnActionDisabled}
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
