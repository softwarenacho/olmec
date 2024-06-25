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
    const offsetX = 120;
    const offsetY = 0;
    ladders.forEach((ladder: SnakeOrLadder, index: number) => {
      const ladderStart = document.getElementById(`tile-${ladder.start}`);
      const ladderEnd = document.getElementById(`tile-${ladder.end}`);
      if (ladderStart && ladderEnd) {
        const startRect = ladderStart.getBoundingClientRect();
        const endRect = ladderEnd.getBoundingClientRect();
        const line = (
          <line
            key={`ladder-${index}`}
            x1={startRect.x - offsetX}
            y1={startRect.y + offsetY}
            x2={endRect.x - offsetX}
            y2={endRect.y + offsetY}
            className={styles.ladder}
          />
        );
        lines.push(line);
      }
    });
    snakes.forEach((snake: SnakeOrLadder, index: number) => {
      const snakeStart = document.getElementById(`tile-${snake.start}`);
      const snakeEnd = document.getElementById(`tile-${snake.end}`);
      if (snakeStart && snakeEnd) {
        const startRect = snakeStart.getBoundingClientRect();
        const endRect = snakeEnd.getBoundingClientRect();
        const line = (
          <line
            key={`snake-${index}`}
            x1={startRect.x - offsetX}
            y1={startRect.y + offsetY}
            x2={endRect.x - offsetX}
            y2={endRect.y + offsetY}
            className={styles.snake}
          />
        );
        lines.push(line);
      }
    });
    return lines;
  };

  useEffect(() => {
    scrollPlayerIntoView();
  }, [playerPosition]);

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
            <span className={styles.player} ref={playerRef}>
              <Image
                src='/icons/jaguar.webp'
                alt='Player Jaguar'
                width={36}
                height={36}
              />
            </span>
            <span className={styles.ai}>
              <Image
                src='/icons/eagle.webp'
                alt='CPU Head'
                width={36}
                height={36}
              />
            </span>
          </div>
        );
      } else if (index === playerPosition) {
        content = (
          <span className={styles.player} ref={playerRef}>
            <Image
              src='/icons/jaguar.webp'
              alt='Player Jaguar'
              width={48}
              height={48}
            />
          </span>
        );
      } else if (index === aiPosition) {
        content = (
          <span className={styles.ai}>
            <Image
              src='/icons/eagle.webp'
              alt='CPU Head'
              width={48}
              height={48}
            />
          </span>
        );
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
    const arrows = getConnections(snakes, ladders);
    setArrows(arrows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiles]);

  useEffect(() => {
    const boardTiles = [];
    for (let i = 100; i > 0; i--) {
      boardTiles.push(renderTile(i));
    }
    setTiles(boardTiles);
  }, [snakes, ladders, aiPosition, playerPosition, renderTile]);

  return (
    <div className={styles.board} ref={boardRef}>
      {tiles}
      <svg
        className={styles.connections}
        width={boardRef.current?.offsetWidth}
        height={boardRef.current?.offsetHeight}
      >
        {arrows}
      </svg>
    </div>
  );
};

export default Board;
