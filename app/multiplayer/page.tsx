'use client';

import { Suspense, useEffect, useState } from 'react';
import Game from '../_components/Game';
import Lobby from '../_components/Lobby';
import Multiplayer, { Player } from '../_components/Multiplayer';
import styles from '../_styles/Game.module.scss';
import { supabase } from '../_utils/supabaseClient';

const GamePage = () => {
  const [avatar, setAvatar] = useState<string>('jaguar.webp');
  const [name, setName] = useState<string>('');
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
      .select(`name, avatar, room, ready, position`);
    setPlayers(data || []);
  };

  const updatePosition = async (position: number) => {
    const { error } = await supabase
      .from('players')
      .update({ position })
      .eq('name', multiplayer.name || '');
    if (error) {
      alert('ERROR UPDATING POSITION');
    }
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

  useEffect(() => {
    const player = players.find((p) => p.name === name);
    if (player && player.avatar !== avatar) {
      setAvatar(player.avatar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, name]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className={styles.main}>
        {gameReady && (
          <Lobby
            updatePosition={updatePosition}
            players={players.filter((p) => p.room == room)}
            resetGame={resetGame}
            multiplayer={multiplayer}
            setMultiplayer={setMultiplayer}
            setPlayers={setPlayers}
            startGame={startGame}
            setGameStart={setGameStart}
            setGameReady={setGameReady}
          />
        )}
        {startGame && (
          <Game
            players={players.filter((p) => p.room == room)}
            multiplayer={multiplayer}
            setMultiplayer={setMultiplayer}
            updatePosition={updatePosition}
          />
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
