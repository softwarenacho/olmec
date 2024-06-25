export interface SnakeOrLadder {
  start: number;
  end: number;
}

const generateUniqueSnakeOrLadder = (
  isSnake: boolean,
  usedIndices: Set<number>
): SnakeOrLadder | null => {
  const startRange = isSnake ? [11, 99] : [2, 98];
  const start = Math.floor(Math.random() * (startRange[1] - startRange[0] + 1)) + startRange[0];

  if (usedIndices.has(start)) return null;

  const end = isSnake
    ? Math.floor(Math.random() * (start - 2)) + 2
    : Math.floor(Math.random() * (100 - start - 1)) + start + 1;

  if (
    usedIndices.has(end) || start === end ||
    start === 1 || start === 100 || end === 1 || end === 100
  ) {
    return null;
  }

  return { start, end };
};

const generateSnakesOrLadders = (
  count: number,
  isSnake: boolean,
  usedIndices: Set<number>,
  allIndices: Set<number>
): SnakeOrLadder[] => {
  const elements: SnakeOrLadder[] = [];

  while (elements.length < count) {
    const element = generateUniqueSnakeOrLadder(isSnake, usedIndices);

    if (element && !allIndices.has(element.start) && !allIndices.has(element.end)) {
      elements.push(element);
      usedIndices.add(element.start);
      usedIndices.add(element.end);
      allIndices.add(element.start);
      allIndices.add(element.end);
    }
  }

  return elements;
};

export const generateSnakesAndLadders = () => {
  const usedIndices = new Set<number>();
  const allIndices = new Set<number>();

  const snakes = generateSnakesOrLadders(5, true, usedIndices, allIndices);
  const ladders = generateSnakesOrLadders(10, false, usedIndices, allIndices);

  return { snakes, ladders };
};
