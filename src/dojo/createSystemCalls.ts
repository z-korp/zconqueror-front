import { Account } from 'starknet';
import { SetupNetworkResult } from './setupNetwork';

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls({ execute }: SetupNetworkResult) {
  const create = async (signer: Account, name: string, playerCount: number) => {
    try {
      await execute(signer, 'zconqueror::systems::host::host', 'create', [playerCount, name]);
    } catch (e) {
      console.error(e);
    }
  };

  const join = async (signer: Account, game_id: number, player_name: string) => {
    try {
      console.log('JOIN');
      console.log(game_id, player_name);
      await execute(signer, 'zconqueror::systems::host::host', 'join', [game_id, player_name]);
    } catch (e) {
      console.error(e);
    }
  };

  const start = async (signer: Account, game_id: number) => {
    try {
      console.log('START');
      await execute(signer, 'zconqueror::systems::host::host', 'start', [game_id]);
    } catch (e) {
      console.error(e);
    }
  };

  const attack = async (
    signer: Account,
    game_id: number,
    attacker_index: number,
    defender_index: number,
    dispatched: number) => {
    try {
      await execute(signer, 'zconqueror::systems::play::play', 'attack', [game_id, attacker_index, defender_index, dispatched]);
    } catch (e) {
      console.error(e);
    }
  };

  const defend = async (
    signer: Account,
    game_id: number,
    attacker_index: number,
    defender_index: number) => {
    try {
      await execute(signer, 'zconqueror::systems::play::play', 'defend', [game_id, attacker_index, defender_index]);
    } catch (e) {
      console.error(e);
    }
  };

  const discard = async (
    signer: Account,
    game_id: number,
    card_one: number, card_two: number, card_three: number) => {
    try {
      await execute(signer, 'zconqueror::systems::play::play', 'discard', [game_id, card_one, card_two, card_three]);
    } catch (e) {
      console.error(e);
    }
  };

  const finish = async (
    signer: Account,
    game_id: number) => {
    try {
      await execute(signer, 'zconqueror::systems::play::play', 'finish', [game_id]);
    } catch (e) {
      console.error(e);
    }
  };

  const transfer = async (
    signer: Account,
    game_id: number,
    source_index: number,
    target_index: number,
    army: number
  ) => {
     try {
      await execute(signer, 'zconqueror::systems::play::play', 'transfer', [game_id, source_index, target_index, army]);
    } catch (e) {
      console.error(e);
    }
  };

  const supply = async (signer: Account, game_id: number, tile_index: number, supply: number) => {
    try {
      await execute(signer, 'zconqueror::systems::play::play', 'transfer', [game_id, tile_index, supply]);
    } catch (e) {
      console.error(e);
    }
  }

  return {
    create,
    join,
    start,
    attack,
    defend,
    discard,
    finish,
    transfer,
    supply,
  };
}