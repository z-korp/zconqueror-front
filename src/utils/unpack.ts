export const unpackU128toU8Array = (u128: number): Uint8Array => {
  const bigIntValue = BigInt(u128); // Convertit le nombre en BigInt
  const bytes = new Uint8Array(16);

  for (let i = 0; i < 16; i++) {
    // Décalage à droite pour obtenir le octet correspondant et masquage pour obtenir les 8 bits de droite
    bytes[i] = Number((bigIntValue >> BigInt(8 * i)) & BigInt(0xff));
  }

  return bytes;
};
