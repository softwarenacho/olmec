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
      if (snakes.some((s) => s.start === index)) tileClass = styles.snakeStart;
      if (snakes.some((s) => s.end === index)) tileClass = styles.snakeEnd;
      if (ladders.some((l) => l.start === index))
        tileClass = styles.ladderStart;
      if (ladders.some((l) => l.end === index)) tileClass = styles.ladderEnd;

      let content = <span>{index}</span>;
      if (index === playerPosition && index === aiPosition) {
        content = (
          <div className={styles.dualPlayer}>
            <span className={styles.player}>P</span>
            <span className={styles.ai}>C</span>
          </div>
        );
      } else if (index === playerPosition) {
        content = <span className={styles.player}>P</span>;
      } else if (index === aiPosition) {
        content = <span className={styles.ai}>C</span>;
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