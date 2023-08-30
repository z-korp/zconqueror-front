import { createContext, ReactNode, useContext } from "react";
import { SetupResult } from "./dojo/setup";
import { useBurner } from "@dojoengine/create-burner";
import { Account, RpcProvider } from "starknet";

const DojoContext = createContext<SetupResult | null>(null);

type Props = {
    children: ReactNode;
    value: SetupResult;
};

export const DojoProvider = ({ children, value }: Props) => {
    const currentValue = useContext(DojoContext);
    if (currentValue) throw new Error("DojoProvider can only be used once");
    return <DojoContext.Provider value={value}>{children}</DojoContext.Provider>;
};

const provider = new RpcProvider({
    nodeUrl: import.meta.env.VITE_LOCAL_NODE_URL,
});

export const useDojo = () => {
    const value = useContext(DojoContext);

    // 
    // this can be substituted with a wallet provider
    //
    const master_address = import.meta.env.VITE_PUBLIC_MASTER_ADDRESS!;
    const private_key = import.meta.env.VITE_PUBLIC_MASTER_PRIVATE_KEY!;
    const masterAccount = new Account(provider, master_address, private_key)

    const { create, list, get, account, select, isDeploying } = useBurner(
        {
            masterAccount: masterAccount,
            accountClassHash: import.meta.env.VITE_PUBLIC_ACCOUNT_CLASS_HASH!
        }
    );

    if (!value) throw new Error("Must be used within a DojoProvider");

    return {
        setup: value,
        account: { create, list, get, select, account: account ? account : masterAccount, isDeploying }
    };
};