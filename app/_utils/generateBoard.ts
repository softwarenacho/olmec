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

  const snakes = generateSnakesOrLadders(15, true, usedIndices, allIndices);
  const ladders = generateSnakesOrLadders(15, false, usedIndices, allIndices);

  return { snakes, ladders };
};

export const generateSpiralBoard = (size: number) => {
  const board = Array.from({ length: size }, () => Array(size).fill(null));
  let num = 1;
  let layers = Math.ceil(size / 2);
  for (let layer = 0; layer < layers; layer++) {
    for (let i = layer; i < size - layer; i++) {
      board[layer][i] = num++;
    }
    for (let i = layer + 1; i < size - layer; i++) {
      board[i][size - layer - 1] = num++;
    }
    for (let i = size - layer - 2; i >= layer; i--) {
      board[size - layer - 1][i] = num++;
    }
    for (let i = size - layer - 2; i > layer; i--) {
      board[i][layer] = num++;
    }
  }
  return board.flat();
};

export const calculateBorderClasses = (index: number, styles: { [key: string]: string; }) => {
  let borderClass = '';
  const boardSize = 10;
  const spiralBoard = generateSpiralBoard(boardSize);
  const position = spiralBoard.indexOf(index);

  const row = Math.floor(position / boardSize);
  const col = position % boardSize;

  const nextPosition = spiralBoard.indexOf(index + 1);
  const prevPosition = spiralBoard.indexOf(index - 1);

  const nextRow = Math.floor(nextPosition / boardSize);
  const nextCol = nextPosition % boardSize;

  const prevRow = Math.floor(prevPosition / boardSize);
  const prevCol = prevPosition % boardSize;

  const isFirstTile = index === 1;
  const isLastTile = index === 100;

  const isTopLeftCorner = isFirstTile || (prevRow > row && prevCol > col);
  const isTopRightCorner = isFirstTile || (prevRow > row && nextCol < col);
  const isBottomLeftCorner = isLastTile || (nextRow < row && prevCol > col);
  const isBottomRightCorner = isLastTile || (nextRow < row && nextCol < col);

  if (
    isFirstTile ||
    isLastTile ||
    isTopLeftCorner ||
    isTopRightCorner ||
    isBottomLeftCorner ||
    isBottomRightCorner
  ) {
    borderClass = ` ${styles.borderTop} ${styles.borderBottom} ${styles.borderLeft} ${styles.borderRight}`;
  } else {
    if (row === prevRow || row === nextRow) {
      borderClass += ` ${styles.borderTop} ${styles.borderBottom}`;
    }
    if (col === prevCol || col === nextCol) {
      borderClass += ` ${styles.borderLeft} ${styles.borderRight}`;
    }
  }

  return borderClass.trim();
};