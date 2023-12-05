// BurnerActions.tsx
import React, { useEffect, useState } from "react";
import { useDojo } from "@/DojoContext";
import { Button } from "./ui/button";

const Burner: React.FC = () => {
	const {
		account: { create, list, select, account, isDeploying },
	} = useDojo();

	const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

	useEffect(() => {
		console.log("isDeploying", isDeploying);
		console.log("account", account);
		console.log("list", list());
	}, [isDeploying]);
	const handleCreate = () => {
		console.log("create");
		create();
		console.log("get list");
		const array = list();
		console.log(isDeploying);
	};

	const handleSelectWallet = (walletAddress: string) => {
		setSelectedWallet(walletAddress);
		select(walletAddress);
	};

	return (
		<div className='flex justify-center p-4'>
			<div className='flex flex-col items-start gap-2'>
				<h3 className='font-bold text-start'>Wallets:</h3>
				<ul className='flex flex-col gap-1'>
					{list().map((wallet) => (
						<li key={wallet.address}>
							<button
								className={`${
									selectedWallet === wallet.address
										? "bg-green-500"
										: "bg-gray-300"
								} hover:bg-green-700 text-white font-bold py-2 px-4 rounded min-w-[670px]`}
								onClick={() =>
									handleSelectWallet(wallet.address)
								}
							>
								{wallet.address}
							</button>
						</li>
					))}
				</ul>
				<Button
					className='self-end'
					onClick={handleCreate}
				>
					{isDeploying ? "Deploying..." : "Create burner"}
				</Button>
			</div>
		</div>
	);
};

export default Burner;
