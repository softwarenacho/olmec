import Image from 'next/image';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from '../_styles/Game.module.scss';
import {
  SnakeOrLadder,
  generateSnakesAndLadders,
} from '../_utils/generateBoard';
import useAudio from '../_utils/useAudio';
import useBgSound from '../_utils/useBackground';
import Board from './Board';
import Dice from './Dice';
import Menu from './Menu';
import { Player } from './Multiplayer';

const Game = ({
  multiplayer,
  setMultiplayer,
  updatePosition,
  players,
}: {
  multiplayer?: Player;
  setMultiplayer?: Dispatch<SetStateAction<Player>>;
  updatePosition?: (n: number) => void;
  players?: any[];
}) => {
  const [playerPosition, setPlayerPosition] = useState(1);
  const [aiPosition, setAiPosition] = useState(multiplayer?.room ? 0 : 1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [resetDice, setResetDice] = useState(false);
  const [playerIsMoving, setPlayerIsMoving] = useState(false);
  const [aiIsMoving, setAiIsMoving] = useState(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [bgMusicOn, setBgMusicOn] = useState(false);
  const [sfxOn, setSfxOn] = useState(false);
  const [snakesAndLadders, setSnakesAndLadders] = useState<{
    snakes: SnakeOrLadder[];
    ladders: SnakeOrLadder[];
  }>({ snakes: [], ladders: [] });

  const { play: upSound } = useAudio('/sounds/up.mp3');
  const { play: downSound } = useAudio('/sounds/down.mp3');
  const { play: playBgSound, stop: stopBgSound } = useBgSound(
    '/sounds/bg.mp3',
    0.2,
    true,
  );
  const { play: playWonSound, stop: stopWonSound } = useBgSound(
    '/sounds/won.mp3',
    0.2,
    false,
  );

  useEffect(() => {
    if (playerPosition === 100 || aiPosition === 100) {
      stopBgSound();
      if (bgMusicOn) playWonSound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerPosition, aiPosition]);

  useEffect(() => {
    setSnakesAndLadders(generateSnakesAndLadders());
    const storedBgMusic = JSON.parse(
      localStorage.getItem('bgMusicOn') || 'true',
    );
    const storedSfx = JSON.parse(localStorage.getItem('sfxOn') || 'true');
    if (storedBgMusic !== null) {
      setBgMusicOn(JSON.parse(storedBgMusic));
    }
    if (storedSfx !== null) {
      setSfxOn(JSON.parse(storedSfx));
    }
    if (storedBgMusic) playBgSound();
    return () => {
      stopBgSound();
      stopWonSound();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleBgMusic = () => {
    bgMusicOn ? stopBgSound() : playBgSound();
    const newValue = !bgMusicOn;
    setBgMusicOn(newValue);
    localStorage.setItem('bgMusicOn', JSON.stringify(newValue));
  };

  const toggleSfx = () => {
    const newValue = !sfxOn;
    setSfxOn(newValue);
    localStorage.setItem('sfxOn', JSON.stringify(newValue));
  };

  const rollDice = (result: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setPlayerIsMoving(true);
    movePlayer(playerPosition, setPlayerPosition, result, () => {
      setPlayerIsMoving(false);
      if (!multiplayer?.room) {
        setAiIsMoving(true);
        const aiRoll = Math.floor(Math.random() * 6) + 1;
        movePlayer(aiPosition, setAiPosition, aiRoll, () => {
          setAiIsMoving(false);
          setIsAnimating(false);
          setTimeout(() => {
            setResetDice(true);
          }, result * 200);
        });
      } else {
        setIsAnimating(false);
        setResetDice(true);
      }
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
      updatePosition && updatePosition(newPosition);
      if (setMultiplayer) {
        setMultiplayer({
          ...multiplayer,
          position: newPosition,
        });
      }
      if (newPosition === position + roll || newPosition >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const snake = snakesAndLadders.snakes.find(
            (s) => s.start === newPosition,
          );
          const ladder = snakesAndLadders.ladders.find(
            (l) => l.start === newPosition,
          );
          if (snake) {
            newPosition = snake.end;
            if (sfxOn) downSound();
          }
          if (ladder) {
            if (sfxOn) upSound();
            newPosition = ladder.end;
          }
          if (setMultiplayer) {
            setMultiplayer({
              ...multiplayer,
              position: newPosition,
            });
          }
          updatePosition && updatePosition(newPosition);
          setPosition(newPosition);
          callback();
        }, 500);
      }
    }, 500);
  };

  const resetBoard = () => {
    setSnakesAndLadders(generateSnakesAndLadders());
    setPlayerPosition(1);
    if (!multiplayer?.room) setAiPosition(1);
    if (setMultiplayer) {
      setMultiplayer({
        ...multiplayer,
        position: 1,
      });
    }
    setGameOver(false);
    stopBgSound();
    stopWonSound();
    if (bgMusicOn) playBgSound();
  };

  return (
    <section className={`${styles.game} ${styles.multi}`}>
      <Menu resetBoard={resetBoard} multiplayer={multiplayer} />
      <Board
        player={multiplayer}
        players={players}
        snakes={snakesAndLadders.snakes}
        ladders={snakesAndLadders.ladders}
        playerPosition={playerPosition}
        aiPosition={aiPosition}
        gameOver={gameOver}
        playerIsMoving={playerIsMoving}
        aiIsMoving={aiIsMoving}
        setGameOver={setGameOver}
        resetBoard={resetBoard}
      />
      <Dice
        rollDice={rollDice}
        resetDice={resetDice}
        playerIsMoving={playerIsMoving}
        aiIsMoving={aiIsMoving}
        gameOver={gameOver}
      />
      <div
        className={`${styles.soundSwitch} ${
          multiplayer?.ready ? styles.switchMulti : ''
        }`}
      >
        <label className={styles.switch}>
          <input type='checkbox' checked={bgMusicOn} onChange={toggleBgMusic} />
          <span className={styles.slider}></span>
          <Image
            src='/icons/music.webp'
            width={32}
            height={32}
            alt='Toggle Background Music'
          />
        </label>
        <label className={styles.switch}>
          <input type='checkbox' checked={sfxOn} onChange={toggleSfx} />
          <span className={styles.slider}></span>
          <Image
            src='/icons/sound.webp'
            width={32}
            height={32}
            alt='Toggle Background Music'
          />
        </label>
      </div>
    </section>
  );
};

export default Game;
