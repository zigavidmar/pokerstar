// Generate a standard deck of cards
export function generateDeck(): string[] {
  const suits = ["h", "d", "c", "s"];
  const values = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "J",
    "Q",
    "K",
    "A",
  ];

  const deck: string[] = [];

  for (const suit of suits) {
    for (const value of values) {
      deck.push(value + suit);
    }
  }

  return shuffleDeck(deck);
}

// Shuffle the deck using Fisher-Yates algorithm
function shuffleDeck(deck: string[]): string[] {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

// Deal a specific number of cards from the deck
export function dealCards(deck: string[], count: number): string[] {
  return deck.slice(0, count);
}

// Get hand ranking options (one correct, two incorrect)
export function getHandOptions(correctAnswer: string): string[] {
  const allHandRankings = [
    "High Card",
    "Pair",
    "Two Pair",
    "Three of a Kind",
    "Straight",
    "Flush",
    "Full House",
    "Four of a Kind",
    "Straight Flush",
    "Royal Flush",
  ];

  // Filter out the correct answer
  const incorrectOptions = allHandRankings.filter(
    (ranking) => ranking !== correctAnswer
  );

  // Shuffle and take two incorrect options
  const shuffledIncorrect = shuffleDeck(incorrectOptions).slice(0, 2);

  // Combine with correct answer and shuffle
  return shuffleDeck([...shuffledIncorrect, correctAnswer]);
}
