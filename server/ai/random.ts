/** Independent streams for match draws, decision dice, and rollout sampling. */
export function seededRandom(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const rollDice = (dice: { count: number; sides: number }, random: () => number) => {
  let value = 0;
  for (let i = 0; i < dice.count; i++) {
    value += 1 + Math.floor(random() * dice.sides);
  }
  return value;
};
export const pickHighest = (scores: number[], random: () => number): number => {
  if (!scores.length) {
    throw new Error("Cannot select from an empty choice list");
  }
  const best = Math.max(...scores);
  const tied = scores.map((score, i) => (score === best ? i : -1)).filter((i) => i >= 0);
  return tied[Math.floor(random() * tied.length)];
};
