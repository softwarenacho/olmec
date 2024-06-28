'use client';

import { Suspense, useState } from 'react';
import Game from '../_components/Game';
import Lobby from '../_components/Lobby';
import Multiplayer, { Player } from '../_components/Multiplayer';
import styles from '../_styles/Game.module.scss';

const GamePage = () => {
  const [avatar, setAvatar] = useState<string>('jaguar.webp');
  const [name, setName] = useState<string>('nacho');
  const [room, setRoom] = useState<string>('waffles');
  const [multiplayer, setMultiplayer] = useState<Player>({});
  const [gameReady, setGameReady] = useState<boolean>(false);
  const [startGame, setGameStart] = useState<boolean>(false);

  const resetGame = () => {
    setGameStart(false);
    setMultiplayer({
      ...multiplayer,
      position: 1,
      ready: true,
    });
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className={styles.main}>
        {gameReady && (
          <Lobby
            resetGame={resetGame}
            multiplayer={multiplayer}
            setMultiplayer={setMultiplayer}
            startGame={startGame}
            setGameStart={setGameStart}
            setGameReady={setGameReady}
          />
        )}
        {startGame && (
          <Game multiplayer={multiplayer} setMultiplayer={setMultiplayer} />
        )}
        {!gameReady && !startGame && (
          <Multiplayer
            avatar={avatar}
            setAvatar={setAvatar}
            name={name}
            setName={setName}
            room={room}
            setRoom={setRoom}
            setMultiplayer={setMultiplayer}
            setGameReady={setGameReady}
          />
        )}
      </main>
    </Suspense>
  );
};

export default GamePage;
