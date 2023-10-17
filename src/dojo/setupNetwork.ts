import { Query, RPCProvider } from '@dojoengine/core';
import { GraphQLClient } from 'graphql-request';
import { Account, AllowArray, Call, num } from 'starknet';
import { getSdk } from '../generated/graphql';
import manifest from './manifest.json';
import { world } from './world';
import { defineContractComponents } from './contractComponents';

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

export const getContractByName = (name: string) => {
  return manifest.contracts.find((contract) => contract.name === name);
};

export async function setupNetwork() {
  // Extract environment variables for better readability.
  const { VITE_PUBLIC_WORLD_ADDRESS, VITE_PUBLIC_NODE_URL, VITE_PUBLIC_TORII } =
    import.meta.env;

  // Create a new RPCProvider instance.
  const provider = new RPCProvider(
    VITE_PUBLIC_WORLD_ADDRESS,
    VITE_PUBLIC_NODE_URL
  );

  // Utility function to get the SDK.
  const createGraphSdk = () => getSdk(new GraphQLClient(VITE_PUBLIC_TORII));

  // Return the setup object.
  return {
    provider,
    world,

    // Define contract components for the world.
    contractComponents: defineContractComponents(world),

    // Define the graph SDK instance.
    graphSdk: createGraphSdk(),

    // Execute function.
    execute: async (signer: Account, calls: AllowArray<Call>) => {
      const formattedCalls = Array.isArray(calls) ? calls : [calls];

      return provider.execute(signer, formattedCalls);
    },

    // Entity query function.
    entity: async (component: string, query: Query) => {
      return provider.entity(component, query);
    },

    // Entities query function.
    entities: async (component: string, partition: number) => {
      return provider.entities(component, partition);
    },

    // Call function.
    call: async (selector: string, call_data: num.BigNumberish[]) => {
      return provider.call(selector, call_data);
    },
  };
}
