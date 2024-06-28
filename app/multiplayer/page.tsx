'use client';

import { Suspense, useState } from 'react';
import Game from '../_components/Game';
import Multiplayer, { Player } from '../_components/Multiplayer';
import styles from '../_styles/Game.module.scss';

const GamePage = () => {
  const [avatar, setAvatar] = useState<string>('jaguar.webp');
  const [name, setName] = useState<string>('waffles');
  const [room, setRoom] = useState<string>('nacho');
  const [multiplayer, setMultiplayer] = useState<Player>({});
  const [gameReady, setGameReady] = useState<boolean>(false);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className={styles.main}>
        {gameReady && (
          <Game multiplayer={multiplayer} setGameReady={setGameReady} />
        )}
        {!gameReady && (
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
