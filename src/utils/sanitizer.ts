import { validateAndParseAddress } from 'starknet';
import { feltToStr, unpackU128toNumberArray } from './unpack';
import { cardTypeFromNumber } from './cards';
import { Player } from './types';

export const sanitizeGame = (game: any) => {
  return {
    ...game,
    host: bigIntAddressToString(game.host),
    player_count: game.player_count,
  };
};

export const sanitizePlayer = (player: any): Player => {
  return {
    ...player,
    address: bigIntAddressToString(player.address),
    cards: unpackU128toNumberArray(player.cards).filter((e: number) => e !== 0),
    name: feltToStr(player.name),
  };
};

export const bigIntAddressToString = (address: bigint) => {
  return removeLeadingZeros(validateAndParseAddress(address));
};

export const shortAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export const removeLeadingZeros = (address: string) => {
  // Check if the address starts with '0x' and then remove leading zeros from the hexadecimal part
  if (address.startsWith('0x')) {
    return '0x' + address.substring(2).replace(/^0+/, '');
  }
  // Return the original address if it doesn't start with '0x'
  return address;
};
