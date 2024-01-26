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

export const feltArrayToString = (input: number): string => {
  const test = BigInt(input);
  return shortString.decodeShortString(test.toString());
};
