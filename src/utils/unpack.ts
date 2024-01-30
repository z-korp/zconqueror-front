export const unpackU128toNumberArray = (u128: number): number[] => {
  const bigIntValue = BigInt(u128); // Convertit le nombre en BigInt
  let numbers = []; // Utilise un tableau simple de nombres

  for (let i = 0; i < 16; i++) {
    let number = Number((bigIntValue >> BigInt(8 * i)) & BigInt(0xff));
    if (number) {
      numbers.push(number);
    }
  }

  return numbers.slice(1);
};

export const feltToStr = (felt: any): string => {
  let hexString = felt.toString(16);
  if (hexString.length % 2) hexString = '0' + hexString; // Ensure even length
  const byteArray = new Uint8Array(hexString.match(/.{1,2}/g).map((byte: any) => parseInt(byte, 16)));
  return new TextDecoder().decode(byteArray);
};
