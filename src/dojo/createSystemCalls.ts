import { getContractByName } from '@dojoengine/core';
import { Component, Components, EntityIndex, Schema, RecsType, setComponent, ComponentValue } from '@latticexyz/recs';
import { poseidonHashMany } from 'micro-starknet';
import { Account, Call, Event, InvokeTransactionReceiptResponse, events, shortString } from 'starknet';
import { ClientComponents } from './createClientComponents';
import manifest from './manifest.json';
import { SetupNetworkResult } from './setupNetwork';

export type SystemCalls = ReturnType<typeof createSystemCalls>;
export function createSystemCalls(
  { execute, contractComponents }: SetupNetworkResult,
  { Game, Player, Tile }: ClientComponents
) {
  const create = async (
    signer: Account,
    name: string,
    playerCount: number,
    onGameCreated: (gameId: number) => void
  ): Promise<number> => {
    let gameId = 0;
    try {
      const calls: Call[] = [
        {
          contractAddress: getContractByName(manifest, 'host') || '',
          entrypoint: 'create',
          calldata: [import.meta.env.VITE_PUBLIC_WORLD_ADDRESS, playerCount, name],
        },
      ];
      const tx = await execute(signer, calls);

      const receipt = (await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      })) as InvokeTransactionReceiptResponse;
      console.log(receipt.events);

      const events = receipt.events;

      if (events) {
        await setComponentsFromEvents(contractComponents, events, onGameCreated);
        // await executeEvents(eventsTransformed);
        // eventsTransformed.forEach((event) => {
        //   if (event.type === 'Game') {
        //     console.log('GAME', event);
        //     gameId = event.entityIndex;
        //   }
        // });
      }
    } catch (e) {
      console.log('ERROR', e);
    }
    return gameId;
  };

  const join = async (
    signer: Account,
    game_id: number,
    player_name: string,
    onGameCreated: (gameId: number) => void
  ) => {
    try {
      console.log('JOIN');
      console.log(game_id, player_name);
      const calls: Call[] = [
        {
          contractAddress: getContractByName(manifest, 'host') || '',
          entrypoint: 'join',
          calldata: [import.meta.env.VITE_PUBLIC_WORLD_ADDRESS, game_id, player_name],
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
        const eventsTransformed = await setComponentsFromEvents(contractComponents, events, onGameCreated);
        // await executeEvents(eventsTransformed);
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log('');
    }
  };

  const start = async (signer: Account, game_id: number) => {
    try {
      const calls: Call[] = [
        {
          contractAddress: getContractByName(manifest, 'host') || '',
          entrypoint: 'start',
          calldata: [import.meta.env.VITE_PUBLIC_WORLD_ADDRESS, game_id],
        },
      ];

      const tx = await execute(signer, calls);
      console.log(tx);
      const receipt = (await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      })) as InvokeTransactionReceiptResponse;
      const events = receipt.events;

      if (events) {
        const eventsTransformed = await setComponentsFromEvents(contractComponents, events);
      }
    } catch (e) {
      console.log(e);
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
          contractAddress: getContractByName(manifest, 'play') || '',
          entrypoint: 'attack',
          calldata: [import.meta.env.VITE_PUBLIC_WORLD_ADDRESS, account, attacker_index, defender_index, dispatched],
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
        const eventsTransformed = await setComponentsFromEvents(contractComponents, events);
        // await executeEvents(eventsTransformed);
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log('');
    }
  };

  const defend = async (signer: Account, account: string, attacker_index: number, defender_index: number) => {
    try {
      const calls: Call[] = [
        {
          contractAddress: getContractByName(manifest, 'play') || '',
          entrypoint: 'defend',
          calldata: [import.meta.env.VITE_PUBLIC_WORLD_ADDRESS, account, attacker_index, defender_index],
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
        const eventsTransformed = await setComponentsFromEvents(contractComponents, events);
        // await executeEvents(eventsTransformed);
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log('');
    }
  };

  const discard = async (signer: Account, account: string, card_one: number, card_two: number, card_three: number) => {
    try {
      const calls: Call[] = [
        {
          contractAddress: getContractByName(manifest, 'play') || '',
          entrypoint: 'discard',
          calldata: [import.meta.env.VITE_PUBLIC_WORLD_ADDRESS, account, card_one, card_two, card_three],
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
        const eventsTransformed = await setComponentsFromEvents(contractComponents, events);
        // await executeEvents(eventsTransformed);
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
          contractAddress: getContractByName(manifest, 'play') || '',
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
        const eventsTransformed = await setComponentsFromEvents(contractComponents, events);
        // await executeEvents(eventsTransformed);
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
          contractAddress: getContractByName(manifest, 'play') || '',
          entrypoint: 'transfer',
          calldata: [import.meta.env.VITE_PUBLIC_WORLD_ADDRESS, account, source_index, target_index, army],
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
        const eventsTransformed = await setComponentsFromEvents(contractComponents, events);
        // await executeEvents(eventsTransformed);
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log('');
    }
  };

  const supply = async (signer: Account, game_id: number, tile_index: number, supply: number) => {
    try {
      const call: Call = {
        contractAddress: getContractByName(manifest, 'play') || '',
        entrypoint: 'supply',
        calldata: [import.meta.env.VITE_PUBLIC_WORLD_ADDRESS, game_id, tile_index, supply],
      };

      const tx = await execute(signer, call);
      console.log(tx);
      const receipt = (await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      })) as InvokeTransactionReceiptResponse;
      console.log(receipt.events);

      const events = receipt.events;

      if (events) {
        const eventsTransformed = await setComponentsFromEvents(contractComponents, events);
        // await executeEvents(eventsTransformed);
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log('');
    }
  };

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
  const gameEvents = events.filter((e): e is GameEvent & ComponentData => e.type === 'Game');
  // console.log('gameEvents', gameEvents);
  for (const e of gameEvents) {
    setComponent(e.component, e.entityIndex, e.componentValues);
    if (e.nonce >= 0) {
      await sleep(1000);
    }
  }

  const tileEvents = events.filter((e): e is TileEvent & ComponentData => e.type === 'Tile');
  // console.log('tileEvents', tileEvents);
  for (const e of tileEvents) {
    setComponent(e.component, e.entityIndex, e.componentValues);
  }

  const playerEvents = events.filter((e): e is PlayerEvent & ComponentData => e.type === 'Player');
  console.log('playerEvents', playerEvents);
  for (const e of playerEvents) {
    //console.log(e._type);
    setComponent(e.component, e.entityIndex, e.componentValues);
  }
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
  const [id, overNumber, seed, player_count, nonce] = values.map((v) => Number(v));
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

// export async function setComponentsFromEvents(components: Components, events: Event[]): Promise<TransformedEvent[]> {
//   const transformedEvents = [];

//   for (const event of events) {
//     const componentName = hexToAscii(event.data[0]);
//     const keysNumber = parseInt(event.data[1]);
//     const keys = event.data.slice(2, 2 + keysNumber).map((key) => BigInt(key));
//     let index = 2 + keysNumber + 1;
//     const numberOfValues = parseInt(event.data[index++]);
//     const values = event.data.slice(index, index + numberOfValues);

//     // Component
//     const component = components[componentName];
//     const componentValues = Object.keys(component.schema).reduce<{
//       [key: string]: string | number;
//     }>((acc, key, index) => {
//       const value = values[index];
//       acc[key] = component.schema[key] === Type.String ? shortString.decodeShortString(value) : Number(value);
//       return acc;
//     }, {});
//     const entity = getEntityIdFromKeys(keys);

//     const baseEventData = {
//       component,
//       componentValues,
//       entityIndex: entity,
//     };

//     switch (componentName) {
//       case 'Game':
//         transformedEvents.push({
//           ...handleGameEvent(keys, values),
//           ...baseEventData,
//         });
//         break;
//       case 'Tile':
//         transformedEvents.push({
//           ...handleTileEvent(keys, values),
//           ...baseEventData,
//         });
//         break;
//       case 'Player':
//         transformedEvents.push({
//           ...handlePlayerEvent(keys, values),
//           ...baseEventData,
//         });
//         break;
//       default:
//         console.log('componentName', componentName);
//         console.log('keys', keys);
//         console.log('values', values);
//     }
//   }

//   return transformedEvents;
// }
export function setComponentsFromEvents(
  components: Components,
  events: Event[],
  onGameCreated?: (gameId: number) => void
) {
  events.forEach((event) => setComponentFromEvent(components, event.data, onGameCreated));
}

export function setComponentFromEvent(
  components: Components,
  eventData: string[],
  onGameCreated?: (gameId: number) => void
) {
  // retrieve the component name
  const componentName = hexToAscii(eventData[0]);

  // retrieve the component from name
  const component = components[componentName];

  // get keys
  const keysNumber = parseInt(eventData[1]);
  let index = 2 + keysNumber + 1;

  const keys = eventData.slice(2, 2 + keysNumber).map((key) => BigInt(key));

  // get entityIndex from keys
  const entityIndex = getEntityIdFromKeys(keys);

  // get values
  let numberOfValues = parseInt(eventData[index++]);

  // get values
  const valuesFromEventData = eventData.slice(index, index + numberOfValues);

  // get component files
  let componentFields = Object.keys(component.schema);

  // Add keys to values if there are extra fields in the component schema (in case we want to add keys to the field values)
  const values =
    valuesFromEventData.length < componentFields.length ? [...keys, ...valuesFromEventData] : valuesFromEventData;

  // create component object from values with schema
  const componentValues = componentFields.reduce((acc: Schema, key, index) => {
    const value = values[index];
    // @ts-ignore
    if (key === 'address') {
      acc[key] = value;
    } else if (key === 'name') {
      acc[key] = shortString.decodeShortString(value.toString());
    } else {
      acc[key] = Number(value);
    }
    return acc;
  }, {});

  switch (componentName) {
    case 'Game':
      const stringArray: string[] = values.map((value) => value.toString());
      handleGameEvent(keys, stringArray);
      break;
    case 'Tile':
      const stringArrayTile: string[] = values.map((value) => value.toString());
      handleTileEvent(keys, stringArrayTile);
      break;
    case 'Player':
      const stringArrayPlayer: string[] = values.map((value) => value.toString());
      handlePlayerEvent(keys, stringArrayPlayer);
      break;
    default:
      console.log('componentName', componentName);
      console.log('keys', keys);
      console.log('values', values);
  }
  if (component.metadata.name === 'Game') {
    if (onGameCreated) {
      onGameCreated(componentValues.id);
    }
  }
  setComponent(component, entityIndex, componentValues);
}
