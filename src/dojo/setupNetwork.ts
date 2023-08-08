import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { RPCProvider, Query } from "@dojoengine/core";
import { Account, num } from "starknet";

export const WORLD_ADDRESS = "0x26065106fa319c3981618e7567480a50132f23932226a51c219ffb8e47daa84"

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

export async function setupNetwork() {

    const contractComponents = defineContractComponents(world);

    const provider = new RPCProvider(WORLD_ADDRESS);

    return {
        contractComponents,
        provider,
        execute: async (signer: Account, system: string, call_data: num.BigNumberish[]) => provider.execute(signer, system, call_data),
        entity: async (component: string, query: Query) => provider.entity(component, query),
        entities: async (component: string, partition: number) => provider.entities(component, partition),
        world
    };
}