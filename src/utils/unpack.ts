import { shortString } from 'starknet';

export const unpackU128toNumberArray = (u128: number): number[] => {
  const bigIntValue = BigInt(u128); // Convertit le nombre en BigInt
  const numbers = []; // Utilise un tableau simple de nombres

  for (let i = 0; i < 16; i++) {
    // Décalage à droite pour obtenir le octet correspondant et masquage pour obtenir les 8 bits de droite
    numbers.push(Number((bigIntValue >> BigInt(8 * i)) & BigInt(0xff)));
  }

  return numbers.slice(1);
};

export const feltToStr = (felt: any): string => {
  let hexString = felt.toString(16);
  if (hexString.length % 2) hexString = '0' + hexString; // Ensure even length
  const byteArray = new Uint8Array(hexString.match(/.{1,2}/g).map((byte: any) => parseInt(byte, 16)));
  return new TextDecoder().decode(byteArray);
};
