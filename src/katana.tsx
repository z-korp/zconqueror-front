import { Chain } from '@starknet-react/chains';
import { KATANA_ETH_CONTRACT_ADDRESS } from '@dojoengine/core';

export const katana: Chain = {
  id: BigInt(420),
  network: 'katana',
  name: 'Katana Devnet',
  nativeCurrency: {
    address: KATANA_ETH_CONTRACT_ADDRESS,
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  testnet: true,
  rpcUrls: {
    default: {
      http: [],
    },
    public: {
      http: ['http://localhost:5050'],
    },
  },
};
