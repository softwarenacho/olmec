import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from '../_styles/Board.module.scss';
import { SnakeOrLadder } from '../_utils/generateBoard';

interface BoardProps {
  snakes: SnakeOrLadder[];
  ladders: SnakeOrLadder[];
  playerPosition: number;
  aiPosition: number;
}

const Board: React.FC<BoardProps> = ({
  snakes,
  ladders,
  playerPosition,
  aiPosition,
}) => {
  const [tiles, setTiles] = useState<React.JSX.Element[]>([]);
  const [arrows, setArrows] = useState<React.JSX.Element[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const scrollPlayerIntoView = () => {
    if (playerRef.current) {
      playerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  };

  const getConnections = (
    snakes: SnakeOrLadder[],
    ladders: SnakeOrLadder[],
  ) => {
    const lines: React.JSX.Element[] = [];
    const offsetX = 200;
    const offsetY = 40;
    const createLine = (
      element: SnakeOrLadder,
      index: number,
      className: string,
    ) => {
      const startElement = document.getElementById(`tile-${element.start}`);
      const endElement = document.getElementById(`tile-${element.end}`);
      if (startElement && endElement) {
        const startRect = startElement.getBoundingClientRect();
        const endRect = endElement.getBoundingClientRect();
        return (
          <line
            key={`${className}-${index}`}
            x1={startRect.x + startRect.width / 2 - offsetX}
            y1={startRect.y + startRect.height / 2 - offsetY}
            x2={endRect.x + endRect.width / 2 - offsetX}
            y2={endRect.y + endRect.height / 2 - offsetY}
            className={className}
          />
        );
      }
      return null;
    };

    ladders.forEach((ladder: SnakeOrLadder, index: number) => {
      const line = createLine(ladder, index, styles.ladder);
      if (line) lines.push(line);
    });

    snakes.forEach((snake: SnakeOrLadder, index: number) => {
      const line = createLine(snake, index, styles.snake);
      if (line) lines.push(line);
    });

    return lines;
  };

  const renderTile = useCallback(
    (index: number) => {
      let tileClass = '';
      const snakeStart = snakes.find((s) => s.start === index);
      const snakeEnd = snakes.find((s) => s.end === index);
      const ladderStart = ladders.find((l) => l.start === index);
      const ladderEnd = ladders.find((l) => l.end === index);
      if (snakeStart) tileClass = styles.snakeStart;
      if (snakeEnd) tileClass = styles.snakeEnd;
      if (ladderStart) tileClass = styles.ladderStart;
      if (ladderEnd) tileClass = styles.ladderEnd;

      let content = (
        <div
          className={`${styles.dualIndex} ${ladderStart ? styles.reverse : ''}`}
        >
          <span className={styles.index}>{index}</span>
          {ladderStart && (
            <i className={styles.arrowUp}>
              <Image
                src='/icons/arrowUp.webp'
                alt='Ladder Up'
                width={20}
                height={20}
              />
            </i>
          )}
          {snakeStart && (
            <i className={styles.arrowDown}>
              <Image
                src='/icons/arrowDown.webp'
                alt='Snake Down'
                width={20}
                height={20}
              />
            </i>
          )}
          {ladderStart && <span className={styles.end}>{ladderStart.end}</span>}
          {snakeStart && <span className={styles.end}>{snakeStart.end}</span>}
        </div>
      );
      if (index === playerPosition && index === aiPosition) {
        content = (
          <div className={styles.dualPlayer}>
            <span className={styles.player} ref={playerRef}></span>
            <span className={styles.ai}></span>
          </div>
        );
      } else if (index === playerPosition) {
        content = <span className={styles.player} ref={playerRef}></span>;
      } else if (index === aiPosition) {
        content = <span className={styles.ai}></span>;
      }

      return (
        <div
          id={`tile-${index}`}
          key={index}
          className={`${styles.tile} ${tileClass}`}
        >
          {content}
        </div>
      );
    },
    [aiPosition, ladders, playerPosition, snakes],
  );

  useEffect(() => {
    if (playerPosition === 100 || aiPosition === 100) {
      setGameOver(true);
    }
  }, [playerPosition, aiPosition]);

  useEffect(() => {
    scrollPlayerIntoView();
  }, [playerPosition]);

  useEffect(() => {
    const arrows = getConnections(snakes, ladders);
    setArrows(arrows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiles]);

  useEffect(() => {
    if (!gameOver) {
      const boardTiles = [];
      for (let i = 100; i > 0; i--) {
        boardTiles.push(renderTile(i));
      }
      setTiles(boardTiles);
    }
  }, [snakes, ladders, aiPosition, playerPosition, renderTile, gameOver]);

  return (
    <div className={styles.board} ref={boardRef}>
      {gameOver && (
        <div className={styles.gameOver}>
          <div className={styles.images}>
            <Image
              src='/icons/olmec.png'
              alt='Game Over Olmec'
              width={100}
              height={100}
            />
            <Image
              src={`/icons/${playerPosition === 100 ? 'jaguar' : 'eagle'}.webp`}
              alt='Player'
              width={200}
              height={200}
            />
            <Image
              src='/icons/olmec.png'
              alt='Game Over Olmec'
              width={100}
              height={100}
            />
          </div>
          <h2>
            {playerPosition === 100 ? 'Jaguar' : 'Eagle'} Won
            {playerPosition === 100 ? '!!!' : ''}
          </h2>
        </div>
      )}
      {!gameOver && (
        <svg
          className={styles.connections}
          width={boardRef.current?.offsetWidth}
          height={boardRef.current?.offsetHeight}
        >
          {arrows}
        </svg>
      )}
      {tiles}
    </div>
  );
};

export default Board;
