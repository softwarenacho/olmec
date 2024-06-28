import Image from 'next/image';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from '../_styles/Board.module.scss';
import { getGradientColor } from '../_utils/generateBackgroundColor';
import {
  SnakeOrLadder,
  calculateBorderClasses,
  generateSpiralBoard,
} from '../_utils/generateBoard';
import { Player } from './Multiplayer';

interface BoardProps {
  player?: Player;
  snakes: SnakeOrLadder[];
  ladders: SnakeOrLadder[];
  playerPosition: number;
  aiPosition: number;
  playerIsMoving: boolean;
  aiIsMoving: boolean;
  gameOver: boolean;
  setGameOver: Dispatch<SetStateAction<boolean>>;
  resetBoard: () => void;
}

const Board = ({
  player,
  snakes,
  ladders,
  playerPosition,
  aiPosition,
  playerIsMoving,
  aiIsMoving,
  gameOver,
  setGameOver,
  resetBoard,
}: BoardProps) => {
  const [tiles, setTiles] = useState<JSX.Element[]>([]);
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

  const playerTile = useCallback(
    () => (
      <span
        className={`${styles.player} ${playerIsMoving ? styles.moving : ''}`}
        style={{
          background: `url('/players/${player?.avatar || 'jaguar.webp'}')`,
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
        }}
        ref={playerRef}
      ></span>
    ),
    [player?.avatar, playerIsMoving],
  );

  const renderTile = useCallback(
    (index: number) => {
      let tileClass = '';
      const snakeStart = snakes.find((s) => s.start === index);
      const snakeEnd = snakes.find((s) => s.end === index);
      const ladderStart = ladders.find((l) => l.start === index);
      const ladderEnd = ladders.find((l) => l.end === index);
      const borderClasses = calculateBorderClasses(index, styles);

      if (snakeStart) tileClass = `${styles.snakeStart} ${borderClasses}`;
      if (snakeEnd) tileClass = `${styles.snakeEnd} ${borderClasses}`;
      if (ladderStart) tileClass = `${styles.ladderStart} ${borderClasses}`;
      if (ladderEnd) tileClass = `${styles.ladderEnd} ${borderClasses}`;

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
            {playerTile()}
            <span
              className={`${styles.ai} ${aiIsMoving ? styles.moving : ''}`}
            ></span>
          </div>
        );
      } else if (index === playerPosition) {
        content = playerTile();
      } else if (index === aiPosition) {
        content = (
          <span
            className={`${styles.ai} ${aiIsMoving ? styles.moving : ''}`}
          ></span>
        );
      }

      return (
        <div
          id={`tile-${index}`}
          key={index}
          className={`${styles.tile} ${tileClass} ${borderClasses} ${
            index === 100 ? styles.pyramid : ''
          } ${index === 1 ? styles.sulfur : ''}`}
          style={{
            backgroundColor: getGradientColor(index),
          }}
        >
          {content}
        </div>
      );
    },
    [aiIsMoving, aiPosition, ladders, playerPosition, playerTile, snakes],
  );

  useEffect(() => {
    if (playerPosition === 100 || aiPosition === 100) {
      setGameOver(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerPosition, aiPosition]);

  useEffect(() => {
    scrollPlayerIntoView();
  }, [playerPosition]);

  useEffect(() => {
    if (!gameOver) {
      const boardSize = 10;
      const spiralBoard = generateSpiralBoard(boardSize);
      const boardTiles = spiralBoard.map((tileNumber: number) =>
        renderTile(tileNumber),
      );
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
              src={`/players/${
                playerPosition === 100
                  ? player?.avatar || 'jaguar.webp'
                  : 'eagle.webp'
              }`}
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
            {playerPosition === 100 ? player?.name || 'Jaguar' : 'Eagle'}{' '}
            Warrior Won
            {playerPosition === 100 ? '!!!' : ''}
          </h2>
          <button onClick={resetBoard}>Play Again</button>
        </div>
      )}
      {tiles}
    </div>
  );
};

export default Board;
