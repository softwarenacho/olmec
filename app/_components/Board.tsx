import Image from 'next/image';
import React, { useCallback } from 'react';
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
        <div className={styles.dualIndex}>
          <span className={styles.index}>{index}</span>
          {ladderStart && (
            <i className={styles.arrowUp}>
              <Image
                src='/icons/arrowUp.png'
                alt='Ladder Up'
                width={16}
                height={16}
              />
            </i>
          )}
          {snakeStart && (
            <i className={styles.arrowDown}>
              <Image
                src='/icons/arrowDown.png'
                alt='Snake Down'
                width={16}
                height={16}
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
            <span className={styles.player}>
              <Image
                src='/icons/jaguar.png'
                alt='Player Jaguar'
                width={48}
                height={48}
              />
            </span>
            <span className={styles.ai}>
              <Image
                src='/icons/eagle.png'
                alt='CPU Head'
                width={48}
                height={48}
              />
            </span>
          </div>
        );
      } else if (index === playerPosition) {
        content = (
          <span className={styles.player}>
            <Image
              src='/icons/jaguar.png'
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
              src='/icons/eagle.png'
              alt='CPU Head'
              width={48}
              height={48}
            />
          </span>
        );
      }

      return (
        <div key={index} className={`${styles.tile} ${tileClass}`}>
          {content}
        </div>
      );
    },
    [aiPosition, ladders, playerPosition, snakes],
  );

  const tiles = [];
  for (let i = 100; i > 0; i--) {
    tiles.push(renderTile(i));
  }

  return (
    <div className={styles.board}>
      {tiles}
      {/* <svg className={styles.connections}>{renderConnections()}</svg> */}
    </div>
  );
};

export default Board;
