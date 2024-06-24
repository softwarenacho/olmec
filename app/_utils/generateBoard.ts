export interface SnakeOrLadder {
  start: number;
  end: number;
}

export function generateSnakesAndLadders() {
  const snakes: SnakeOrLadder[] = [];
  const ladders: SnakeOrLadder[] = [];

  // Randomly generate snakes
  while (snakes.length < 5) {
    const start = Math.floor(Math.random() * 90) + 10;
    const end = Math.floor(Math.random() * (start - 1)) + 1;
    if (!snakes.some(s => s.start === start) && !ladders.some(l => l.start === start)) {
      snakes.push({ start, end });
    }
  }

  // Randomly generate ladders
  while (ladders.length < 5) {
    const start = Math.floor(Math.random() * 90) + 1;
    const end = Math.floor(Math.random() * (100 - start)) + start + 1;
    if (!ladders.some(l => l.start === start) && !snakes.some(s => s.start === start)) {
      ladders.push({ start, end });
    }
  }

  return { snakes, ladders };
}
