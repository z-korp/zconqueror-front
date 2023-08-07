import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { RPCProvider, Query } from "@dojoengine/core";
import { Account, num } from "starknet";

export const KATANA_ACCOUNT_1_ADDRESS = "0x03ee9e18edc71a6df30ac3aca2e0b02a198fbce19b7480a63a0d71cbd76652e0"
export const KATANA_ACCOUNT_1_PRIVATEKEY = "0x0300001800000000300000180000000000030000000000003006001800006600"
export const WORLD_ADDRESS = "0xbe7ba74325b10832a747f87c1dbca5c1a70c6d56c1000a0f89f90cb126287f"
export const EVENT_KEY = "0x1a2f334228cee715f1f0f54053bb6b5eac54fa336e0bc1aacf7516decb0471d"


export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

export async function setupNetwork() {

    const contractComponents = defineContractComponents(world);

    const provider = new RPCProvider(WORLD_ADDRESS);

    const signer = new Account(
        {
            rpc: {
                nodeUrl: "http://localhost:5050"
            }
        },
        KATANA_ACCOUNT_1_ADDRESS,
        KATANA_ACCOUNT_1_PRIVATEKEY
    )

    return {
        contractComponents,
        provider,
        signer,
        execute: async (system: string, call_data: num.BigNumberish[]) => provider.execute(signer, system, call_data),
        entity: async (component: string, query: Query) => provider.entity(component, query),
        entities: async (component: string, partition: number) => provider.entities(component, partition),
        world
    };
}