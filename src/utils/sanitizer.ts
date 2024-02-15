import { validateAndParseAddress } from 'starknet';
import { feltToStr, unpackU128toNumberArray } from './unpack';

export const sanitizeGame = (game: any) => {
  return {
    host: bigIntAddressToString(game.host),
    id: game.id,
    nonce: game.nonce,
    over: game.over,
    player_count: game.player_count,
    seed: game.seed,
    slots: game.slots,
  };
};

export const sanitizePlayer = (player: any) => {
  return {
    index: player.index,
    game_id: player.game_id,
    address: bigIntAddressToString(player.address),
    cards: unpackU128toNumberArray(player.cards).filter((e: number) => e !== 0),
    conqueror: player.conqueror,
    name: feltToStr(player.name),
    supply: player.supply,
  };
};

export const bigIntAddressToString = (address: bigint) => {
  return formatStarkNetAddress(validateAndParseAddress(address));
};

export const formatStarkNetAddress = (address: string) => {
  //console.log('formatStarkNetAddress', address);
  // Ensure the address is a hex string without the '0x' prefix
  const hexAddress = address.startsWith('0x') ? address.slice(2) : address;
  // Pad the address to 64 bytes (128 characters) length
  const paddedAddress = hexAddress.padStart(64, '0');
  return '0x' + paddedAddress;
};

export const shortAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};
