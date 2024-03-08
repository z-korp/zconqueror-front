export enum CardType {
  Joker,
  Infantry,
  Cavalry,
  Artillery,
}

const TILE_NUMBER = 50;

export const cardTypeFromNumber = (cardNumber: number): CardType => {
  if (cardNumber > TILE_NUMBER) return CardType.Joker;

  return (cardNumber % 3) + 1;
};

export const canBeExchanged = (cards: CardType[]): boolean => {
  // Early return for cases where exchange is not possible
  if (cards.length < 3) return false;
  if (cards.length === 5) return true;

  // Count occurrences of each card type
  const counts = { [CardType.Joker]: 0, [CardType.Infantry]: 0, [CardType.Cavalry]: 0, [CardType.Artillery]: 0 };
  cards.forEach((card) => counts[card]++);

  // Check for a set of three identical cards, considering Jokers
  const canExchangeIdentical = Object.entries(counts).some(([type, count]) => {
    if (type === CardType.Joker.toString()) return false; // Skip Jokers in this check
    return count + counts[CardType.Joker] >= 3; // Add Jokers to count of each type
  });
  if (canExchangeIdentical) return true;

  // Check for the possibility of a mixed exchange using Jokers as needed
  const canExchangeMixed = () => {
    const missingTypes =
      3 - [CardType.Infantry, CardType.Cavalry, CardType.Artillery].filter((type) => counts[type] > 0).length; // Count how many types are missing
    const availableJokers = counts[CardType.Joker];

    return availableJokers >= missingTypes;
  };

  if (canExchangeMixed()) return true;

  return false;
};
