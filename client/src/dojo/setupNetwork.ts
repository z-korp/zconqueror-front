import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { RPCProvider, Query, } from "@dojoengine/core";
import { Account, num } from "starknet";
import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../generated/graphql';

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

export async function setupNetwork() {

    const provider = new RPCProvider(import.meta.env.VITE_PUBLIC_WORLD_ADDRESS!, import.meta.env.VITE_LOCAL_NODE_URL);

    return {
        contractComponents: defineContractComponents(world),
        provider,
        execute: async (signer: Account, system: string, call_data: num.BigNumberish[]) => provider.execute(signer, system, call_data),
        entity: async (component: string, query: Query) => provider.entity(component, query),
        entities: async (component: string, partition: number) => provider.entities(component, partition),
        world,
        graphSdk: getSdk(new GraphQLClient(import.meta.env.VITE_LOCAL_TORII))
    };
}