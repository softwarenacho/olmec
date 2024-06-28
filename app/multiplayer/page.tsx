'use client';

import { Suspense, useEffect, useState } from 'react';
import Game from '../_components/Game';
import Lobby from '../_components/Lobby';
import Multiplayer, { Player } from '../_components/Multiplayer';
import styles from '../_styles/Game.module.scss';
import { supabase } from '../_utils/supabaseClient';

const GamePage = () => {
  const [avatar, setAvatar] = useState<string>('jaguar.webp');
  const [name, setName] = useState<string>('nacho');
  const [room, setRoom] = useState<string>('waffles');
  const [rooms, setRooms] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [multiplayer, setMultiplayer] = useState<Player>({});
  const [gameReady, setGameReady] = useState<boolean>(false);
  const [startGame, setGameStart] = useState<boolean>(false);

  const getRooms = async () => {
    const { data } = await supabase.from('rooms').select(`name`);
    setRooms(data || []);
  };

  const getPlayers = async () => {
    const { data } = await supabase
      .from('players')
      .select(`name, avatar, room`);
    setPlayers(data || []);
  };

  useEffect(() => {
    getRooms();
    getPlayers();
  }, []);

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
            players={players}
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
            rooms={rooms}
            setRooms={setRooms}
            players={players.filter((p) => p.room == room)}
            setPlayers={setPlayers}
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
