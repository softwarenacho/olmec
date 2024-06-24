import React, { useEffect, useState } from 'react';
import styles from '../_styles/Game.module.scss';
import {
  SnakeOrLadder,
  generateSnakesAndLadders,
} from '../_utils/generateBoard';
import Board from './Board';
import Dice from './Dice';

const Game: React.FC = () => {
  const [playerPosition, setPlayerPosition] = useState(1);
  const [aiPosition, setAiPosition] = useState(1);
  const [snakesAndLadders, setSnakesAndLadders] = useState<{
    snakes: SnakeOrLadder[];
    ladders: SnakeOrLadder[];
  }>({ snakes: [], ladders: [] });
  const [isAnimating, setIsAnimating] = useState(false);
  const [resetDice, setResetDice] = useState(false);
  const [playerIsMoving, setPlayerIsMoving] = useState(false);
  const [aiIsMoving, setAiIsMoving] = useState(false);

  useEffect(() => {
    setSnakesAndLadders(generateSnakesAndLadders());
  }, []);

  const rollDice = (result: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setPlayerIsMoving(true);
    movePlayer(playerPosition, setPlayerPosition, result, () => {
      setPlayerIsMoving(false);
      setAiIsMoving(true);
      const aiRoll = Math.floor(Math.random() * 6) + 1;
      movePlayer(aiPosition, setAiPosition, aiRoll, () => {
        setAiIsMoving(false);
        setIsAnimating(false);
        setTimeout(() => {
          setResetDice(true);
        }, result * 500);
      });
    });
  };

  const movePlayer = (
    position: number,
    setPosition: React.Dispatch<React.SetStateAction<number>>,
    roll: number,
    callback: () => void,
  ) => {
    let newPosition = position;
    const interval = setInterval(() => {
      newPosition++;
      setPosition(newPosition);
      if (newPosition === position + roll || newPosition >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const snake = snakesAndLadders.snakes.find(
            (s) => s.start === newPosition,
          );
          const ladder = snakesAndLadders.ladders.find(
            (l) => l.start === newPosition,
          );
          if (snake) newPosition = snake.end;
          if (ladder) newPosition = ladder.end;
          setPosition(newPosition);
          callback();
        }, 500);
      }
    }, 500);
  };

  return (
    <div className={styles.game}>
      <Board
        snakes={snakesAndLadders.snakes}
        ladders={snakesAndLadders.ladders}
        playerPosition={playerPosition}
        aiPosition={aiPosition}
      />
      <Dice
        rollDice={rollDice}
        resetDice={resetDice}
        playerIsMoving={playerIsMoving}
        aiIsMoving={aiIsMoving}
      />
    </div>
  );
};

export default Game;