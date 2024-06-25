export interface SnakeOrLadder {
  start: number;
  end: number;
}

export const generateSnakesAndLadders = () => {
  const snakes: SnakeOrLadder[] = [];
  const ladders: SnakeOrLadder[] = [];

  const snakesNumber = 5;
  const laddersNumber = 10;
  const usedIndices = new Set<number>();

  while (snakes.length < snakesNumber) {
    const start = Math.floor(Math.random() * 90) + 10;
    const end = Math.floor(Math.random() * (start - 1)) + 2;

    if (
      !usedIndices.has(start) &&
      !usedIndices.has(end) &&
      !snakes.some(s => s.start === start || s.end === end) &&
      !ladders.some(l => l.start === start || l.end === end)
    ) {
      snakes.push({ start, end });
      usedIndices.add(start);
      usedIndices.add(end);
    }
  }

  while (ladders.length < laddersNumber) {
    const start = Math.floor(Math.random() * 90) + 2;
    const end = Math.floor(Math.random() * (100 - start)) + start + 2;

    if (
      !usedIndices.has(start) &&
      !usedIndices.has(end) &&
      !ladders.some(l => l.start === start || l.end === end) &&
      !snakes.some(s => s.start === start || s.end === end)
    ) {
      ladders.push({ start, end });
      usedIndices.add(start);
      usedIndices.add(end);
    }
  }

  return { snakes, ladders };
};
