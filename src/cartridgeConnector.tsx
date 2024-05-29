import { Connector } from '@starknet-react/core';
import CartridgeConnector from '@cartridge/connector';
import { getContractByName } from '@dojoengine/core';
import manifest from './assets/manifests/sepolia/manifest.json';

const host_contract_address = getContractByName(manifest, 'zconqueror::systems::host::host')?.address;
const play_contract_address = getContractByName(manifest, 'zconqueror::systems::play::play')?.address;
console.log('host_contract_address:', host_contract_address);
console.log('play_contract_address:', play_contract_address);

const cartridgeConnector = new CartridgeConnector([
  {
    target: import.meta.env.VITE_PUBLIC_FEE_TOKEN_ADDRESS,
    method: 'approve',
  },
  {
    target: import.meta.env.VITE_PUBLIC_ACCOUNT_CLASS_HASH,
    method: 'initialize',
  },
  {
    target: import.meta.env.VITE_PUBLIC_ACCOUNT_CLASS_HASH,
    method: 'create',
  },
  // host
  {
    target: host_contract_address,
    method: 'create',
  },
  {
    target: host_contract_address,
    method: 'join',
  },
  {
    target: host_contract_address,
    method: 'leave',
  },
  {
    target: host_contract_address,
    method: 'start',
  },
  {
    target: host_contract_address,
    method: 'kick',
  },
  {
    target: host_contract_address,
    method: 'transfer',
  },
  {
    target: host_contract_address,
    method: 'delete',
  },
  {
    target: host_contract_address,
    method: 'claim',
  },
  // play
  {
    target: play_contract_address,
    method: 'attack',
  },
  {
    target: play_contract_address,
    method: 'surrender',
  },
  {
    target: play_contract_address,
    method: 'banish',
  },
  {
    target: play_contract_address,
    method: 'defend',
  },
  {
    target: play_contract_address,
    method: 'discard',
  },
  {
    target: play_contract_address,
    method: 'finish',
  },
  {
    target: play_contract_address,
    method: 'transfer',
  },
  {
    target: play_contract_address,
    method: 'supply',
  },
  {
    target: play_contract_address,
    method: 'emote',
  },
]) as never as Connector;

export default cartridgeConnector;
