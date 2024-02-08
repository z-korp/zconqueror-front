import { getSyncEntities } from '@dojoengine/state';
import * as torii from '@dojoengine/torii-client';
import { createClientComponents } from './createClientComponents';
//import { createSystemCalls } from './createSystemCalls';
import { DojoProvider } from '@dojoengine/core';
import { Config } from '../../DojoConfig';
import { defineContractComponents } from './contractComponents';
import { setupWorld } from './generated/generated';
import { world } from './world';
import { createUpdates } from './createUpdates';

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: Config) {
  // torii client
  const toriiClient = await torii.createClient([], {
    rpcUrl: config.rpcUrl,
    toriiUrl: config.toriiUrl,
    worldAddress: config.manifest.world.address,
  });

  // create contract components
  const contractComponents = defineContractComponents(world);

  // create client components
  const clientComponents = createClientComponents({ contractComponents });

  // fetch all existing entities from torii
  await getSyncEntities(toriiClient, contractComponents as any);

  const client = await setupWorld(new DojoProvider(config.manifest, config.rpcUrl));

  const updates = await createUpdates(clientComponents);

  return {
    client,
    clientComponents,
    contractComponents,
    config,
    world,
    updates,
  };
}
