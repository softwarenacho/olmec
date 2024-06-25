export interface SnakeOrLadder {
  start: number;
  end: number;
}

export const generateSnakesAndLadders = () => {
  const snakes: SnakeOrLadder[] = [];
  const ladders: SnakeOrLadder[] = [];

  const snakesNumber = 5;
  const laddersNumber = 10;

  while (snakes.length < snakesNumber) {
    const start = Math.floor(Math.random() * 90) + 10;
    const end = Math.floor(Math.random() * (start - 1)) + 2;
    if (!snakes.some(s => s.start === start) && !ladders.some(l => l.start === start)) {
      snakes.push({ start, end });
    }
  }

  while (ladders.length < laddersNumber) {
    const start = Math.floor(Math.random() * 90) + 2;
    const end = Math.floor(Math.random() * (100 - start)) + start + 2;
    if (!ladders.some(l => l.start === start) && !snakes.some(s => s.start === start)) {
      ladders.push({ start, end });
    }
  }

  return { snakes, ladders };
};
