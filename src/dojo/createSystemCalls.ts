import {
  Component,
  Components,
  EntityIndex,
  Schema,
  Type,
  setComponent,
} from '@latticexyz/recs';
import { poseidonHashMany } from 'micro-starknet';
import {
  Account,
  Call,
  Event,
  InvokeTransactionReceiptResponse,
  shortString,
} from 'starknet';
import { ClientComponents } from './createClientComponents';
import { SetupNetworkResult, getContractByName } from './setupNetwork';

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { execute, contractComponents }: SetupNetworkResult,
  { Game, Player, Tile }: ClientComponents
) {
  //account: felt252, seed: felt252, name: felt252, player_count: u8
  const create = async (
    signer: Account,
    account: string,
    seed: number,
    name: string,
    playerCount: number
  ) => {
    try {
      const calls: Call[] = [
        {
          contractAddress: getContractByName('actions')?.address || '',
          entrypoint: 'create',
          calldata: [
            import.meta.env.VITE_PUBLIC_WORLD_ADDRESS,
            account,
            seed,
            name,
            playerCount,
          ],
        },
      ];

      const tx = await execute(signer, calls);

      console.log(tx);
      const receipt = (await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      })) as InvokeTransactionReceiptResponse;
      console.log(receipt.events);

      const events = receipt.events;

      if (events) {
        const eventsTransformed = await setComponentsFromEvents(
          contractComponents,
          events
        );
        await executeEvents(eventsTransformed);
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log('');
    }
  };

  const attack = async (
    signer: Account,
    account: string,
    attacker_index: number,
    defender_index: number,
    dispatched: number
  ) => {
    try {
      const calls: Call[] = [
        {
          contractAddress: getContractByName('actions')?.address || '',
          entrypoint: 'attack',
          calldata: [
            import.meta.env.VITE_PUBLIC_WORLD_ADDRESS,
            account,
            attacker_index,
            defender_index,
            dispatched,
          ],
        },
      ];

      const tx = await execute(signer, calls);

      console.log(tx);
      const receipt = (await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      })) as InvokeTransactionReceiptResponse;
      console.log(receipt.events);

      const events = receipt.events;

      if (events) {
        const eventsTransformed = await setComponentsFromEvents(
          contractComponents,
          events
        );
        await executeEvents(eventsTransformed);
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log('');
    }
  };

  const defend = async (
    signer: Account,
    account: string,
    attacker_index: number,
    defender_index: number
  ) => {
    try {
      const calls: Call[] = [
        {
          contractAddress: getContractByName('actions')?.address || '',
          entrypoint: 'defend',
          calldata: [
            import.meta.env.VITE_PUBLIC_WORLD_ADDRESS,
            account,
            attacker_index,
            defender_index,
          ],
        },
      ];

      const tx = await execute(signer, calls);

      console.log(tx);
      const receipt = (await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      })) as InvokeTransactionReceiptResponse;
      console.log(receipt.events);

      const events = receipt.events;

      if (events) {
        const eventsTransformed = await setComponentsFromEvents(
          contractComponents,
          events
        );
        await executeEvents(eventsTransformed);
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log('');
    }
  };

  const discard = async (
    signer: Account,
    account: string,
    card_one: number,
    card_two: number,
    card_three: number
  ) => {
    try {
      const calls: Call[] = [
        {
          contractAddress: getContractByName('actions')?.address || '',
          entrypoint: 'discard',
          calldata: [
            import.meta.env.VITE_PUBLIC_WORLD_ADDRESS,
            account,
            card_one,
            card_two,
            card_three,
          ],
        },
      ];

      const tx = await execute(signer, calls);

      console.log(tx);
      const receipt = (await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      })) as InvokeTransactionReceiptResponse;
      console.log(receipt.events);

      const events = receipt.events;

      if (events) {
        const eventsTransformed = await setComponentsFromEvents(
          contractComponents,
          events
        );
        await executeEvents(eventsTransformed);
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log('');
    }
  };

  const finish = async (signer: Account, account: string) => {
    try {
      const calls: Call[] = [
        {
          contractAddress: getContractByName('actions')?.address || '',
          entrypoint: 'finish',
          calldata: [import.meta.env.VITE_PUBLIC_WORLD_ADDRESS, account],
        },
      ];

      const tx = await execute(signer, calls);

      console.log(tx);
      const receipt = (await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      })) as InvokeTransactionReceiptResponse;
      console.log(receipt.events);

      const events = receipt.events;

      if (events) {
        const eventsTransformed = await setComponentsFromEvents(
          contractComponents,
          events
        );
        await executeEvents(eventsTransformed);
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log('');
    }
  };

  const transfer = async (
    signer: Account,
    account: string,
    source_index: number,
    target_index: number,
    army: number
  ) => {
    try {
      const calls: Call[] = [
        {
          contractAddress: getContractByName('actions')?.address || '',
          entrypoint: 'transfer',
          calldata: [
            import.meta.env.VITE_PUBLIC_WORLD_ADDRESS,
            account,
            source_index,
            target_index,
            army,
          ],
        },
      ];

      const tx = await execute(signer, calls);

      console.log(tx);
      const receipt = (await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      })) as InvokeTransactionReceiptResponse;
      console.log(receipt.events);

      const events = receipt.events;

      if (events) {
        const eventsTransformed = await setComponentsFromEvents(
          contractComponents,
          events
        );
        await executeEvents(eventsTransformed);
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log('');
    }
  };

  const supply = async (
    signer: Account,
    account: string,
    tile_index: number,
    supply: number
  ) => {
    try {
      const call: Call = {
        contractAddress: getContractByName('actions')?.address || '',
        entrypoint: 'supply',
        calldata: [
          import.meta.env.VITE_PUBLIC_WORLD_ADDRESS,
          account,
          tile_index,
          supply,
        ],
      };

      const tx = await execute(signer, call);
      console.log(tx);
      const receipt = (await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      })) as InvokeTransactionReceiptResponse;
      console.log(receipt.events);

      const events = receipt.events;

      if (events) {
        const eventsTransformed = await setComponentsFromEvents(
          contractComponents,
          events
        );
        await executeEvents(eventsTransformed);
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log('');
    }
  };

  return {
    create,
    attack,
    defend,
    discard,
    finish,
    transfer,
    supply,
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function executeEvents(events: TransformedEvent[]) {
  for (const e of events) {
    setComponent(e.component, e.entityIndex, e.componentValues);
    if (e.type === 'Game') {
      await sleep(1000);
    }
  }
  /*const gameEvents = events.filter(
    (e): e is GameEvent & ComponentData => e.type === 'Game'
  );
  // console.log('gameEvents', gameEvents);
  for (const e of gameEvents) {
    setComponent(e.component, e.entityIndex, e.componentValues);
    if (e.nonce >= 0) {
      await sleep(1000);
    }
  }

  const tileEvents = events.filter(
    (e): e is TileEvent & ComponentData => e.type === 'Tile'
  );
  // console.log('tileEvents', tileEvents);
  for (const e of tileEvents) {
    setComponent(e.component, e.entityIndex, e.componentValues);
  }

  const playerEvents = events.filter(
    (e): e is PlayerEvent & ComponentData => e.type === 'Player'
  );
  // console.log('playerEvents', playerEvents);
  for (const e of playerEvents) {
    //console.log(e._type);
    setComponent(e.component, e.entityIndex, e.componentValues);
  }*/
}

function hexToAscii(hex: string) {
  let str = '';
  for (let n = 2; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

export function getEntityIdFromKeys(keys: bigint[]): EntityIndex {
  if (keys.length === 1) {
    return parseInt(keys[0].toString()) as EntityIndex;
  }
  // calculate the poseidon hash of the keys
  const poseidon = poseidonHashMany([BigInt(keys.length), ...keys]);
  return parseInt(poseidon.toString()) as EntityIndex;
}

type GameEvent = ComponentData & {
  type: 'Game';
  account: number;
  id: number;
  over: boolean;
  seed: number;
  player_count: number;
  nonce: number;
};

function handleGameEvent(
  keys: bigint[],
  values: string[]
): Omit<GameEvent, 'component' | 'componentValues' | 'entityIndex'> {
  const [account] = keys.map((k) => Number(k));
  const [id, overNumber, seed, player_count, nonce] = values.map((v) =>
    Number(v)
  );
  const over = overNumber === 1;
  console.log(
    `[Game: KEYS: (account: ${account}) - VALUES: (game_id: ${id}, over: ${over}, seed: ${seed}, player_count: ${player_count}, nonce: ${nonce})]`
  );
  return {
    type: 'Game',
    account,
    id,
    over,
    seed,
    player_count,
    nonce,
  };
}

type TileEvent = ComponentData & {
  type: 'Tile';
  game_id: number;
  id: number;
  army: number;
  owner: number;
  dispatched: number;
};

function handleTileEvent(
  keys: bigint[],
  values: string[]
): Omit<TileEvent, 'component' | 'componentValues' | 'entityIndex'> {
  const [game_id, id] = keys.map((k) => Number(k));
  const [army, owner, dispatched] = values.map((v) => Number(v));
  console.log(
    `[Tile: KEYS: (game_id: ${game_id}, id: ${id}) - VALUES: (army: ${army}, owner: ${owner}, dispatched: ${dispatched})]`
  );
  return {
    type: 'Tile',
    game_id,
    id,
    army,
    owner,
    dispatched,
  };
}

type PlayerEvent = ComponentData & {
  type: 'Player';
  game_id: number;
  order: number;
  address: string;
  name: string;
  supply: number;
};

function handlePlayerEvent(
  keys: bigint[],
  values: string[]
): Omit<PlayerEvent, 'component' | 'componentValues' | 'entityIndex'> {
  const [game_id, order] = keys.map((k) => Number(k));
  const [addressRaw, nameRaw, supplyRaw] = values;

  const address = addressRaw;
  const name = shortString.decodeShortString(nameRaw);
  const supply = Number(supplyRaw);

  console.log(
    `[Player: KEYS: (game_id: ${game_id}, order: ${order}) - VALUES: (address: ${address}, name: ${name}, supply: ${supply})]`
  );
  return {
    type: 'Player',
    game_id,
    order,
    address,
    name,
    supply,
  };
}

type ComponentData = {
  component: Component;
  componentValues: Schema;
  entityIndex: EntityIndex;
};

type TransformedEvent = GameEvent | TileEvent | PlayerEvent;

export async function setComponentsFromEvents(
  components: Components,
  events: Event[]
): Promise<TransformedEvent[]> {
  const transformedEvents = [];

  for (const event of events) {
    const componentName = hexToAscii(event.data[0]);
    const keysNumber = parseInt(event.data[1]);
    const keys = event.data.slice(2, 2 + keysNumber).map((key) => BigInt(key));
    let index = 2 + keysNumber + 1;
    const numberOfValues = parseInt(event.data[index++]);
    const values = event.data.slice(index, index + numberOfValues);

    // Component
    const component = components[componentName];
    const componentValues = Object.keys(component.schema).reduce<{
      [key: string]: string | number;
    }>((acc, key, index) => {
      const value = values[index];
      acc[key] =
        component.schema[key] === Type.String
          ? shortString.decodeShortString(value)
          : Number(value);
      return acc;
    }, {});
    const entity = getEntityIdFromKeys(keys);

    const baseEventData = {
      component,
      componentValues,
      entityIndex: entity,
    };

    switch (componentName) {
      case 'Game':
        transformedEvents.push({
          ...handleGameEvent(keys, values),
          ...baseEventData,
        });
        break;
      case 'Tile':
        transformedEvents.push({
          ...handleTileEvent(keys, values),
          ...baseEventData,
        });
        break;
      case 'Player':
        transformedEvents.push({
          ...handlePlayerEvent(keys, values),
          ...baseEventData,
        });
        break;
      default:
        console.log('componentName', componentName);
        console.log('keys', keys);
        console.log('values', values);
    }
  }

  return transformedEvents;
}
