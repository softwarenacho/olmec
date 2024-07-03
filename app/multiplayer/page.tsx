'use client';

import { Suspense, useEffect, useState } from 'react';
import Game from '../_components/Game';
import Lobby from '../_components/Lobby';
import Multiplayer, { Player } from '../_components/Multiplayer';
import styles from '../_styles/Game.module.scss';
import { supabase } from '../_utils/supabaseClient';

const GamePage = () => {
  const [avatar, setAvatar] = useState<string>('jaguar.webp');
  const [name, setName] = useState<string>('oli');
  const [room, setRoom] = useState<string>('waffles');
  const [rooms, setRooms] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [multiplayer, setMultiplayer] = useState<Player>({});
  const [gameReady, setGameReady] = useState<boolean>(false);
  const [startGame, setGameStart] = useState<boolean>(false);
  const [showActions, setShowActions] = useState<boolean>(true);

  const getRooms = async () => {
    const { data } = await supabase.from('rooms').select(`name, owner, ready`);
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

  const resetGame = async () => {
    const gamePlayers = players
      .filter((p) => p.room == room)
      .filter((p) => p.ready);
    await Promise.all(
      gamePlayers.map((player: any) => resetPlayer(player.name)),
    );
    setGameStart(false);
    setMultiplayer({
      ...multiplayer,
      position: 1,
      ready: true,
    });
  };

  const resetPlayer = async (name: string) => {
    await supabase
      .from('players')
      .update({ position: 1, ready: false })
      .eq('name', name || '');
  };

  const updateReadiness = async (ready: boolean) => {
    const { error } = await supabase
      .from('players')
      .update({ ready })
      .eq('name', multiplayer.name || '');
    if (!error) {
      setMultiplayer({
        ...multiplayer,
        position: ready ? 1 : 0,
        ready: ready,
      });
      updatePosition(ready ? 1 : 0);
    }
  };

  const roomSubscription = (payload: any) => {
    const changed: any = rooms.find((r) => r.name === payload.new.name);
    const others = rooms.filter((p) => p.name !== payload.new.name);
    if (changed && changed.ready !== startGame) {
      setGameStart(changed.ready);
      setShowActions(!changed.ready);
      const newRooms = [...others, changed];
      setRooms(newRooms);
    }
  };

  const playersSubscription = (payload: any) => {
    console.log('🚀 ~ playersSubscription ~ payload:', payload);
    const changed = players.filter((p) => p.name === payload.new.name);
    const others = players.filter((p) => p.name !== payload.new.name);
    const updatedPlayer = {
      ...changed[0],
      avatar: payload.new.avatar,
      position: payload.new.position,
      ready: payload.new.ready,
    };
    const newPlayers = [...others, updatedPlayer];
    setPlayers(newPlayers);
  };

  useEffect(() => {
    const roomReadiness = async (ready: boolean) => {
      await supabase
        .from('rooms')
        .update({ ready: !!ready })
        .eq('name', multiplayer.room || '');
    };
    roomReadiness(startGame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startGame]);

  useEffect(() => {
    const player = players.find((p) => p.name === name);
    if (player && player.avatar !== avatar) {
      setAvatar(player.avatar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, name]);

  useEffect(() => {
    const channel = supabase.channel(multiplayer.room || 'default');
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
        },
        (payload: any) => playersSubscription(payload),
      )
      .subscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const channel = supabase.channel(multiplayer.room || 'default');
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
        },
        (payload: any) => roomSubscription(payload),
      )
      .subscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getRooms();
    getPlayers();
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className={styles.main}>
        {gameReady && (
          <Lobby
            showActions={showActions}
            setShowActions={setShowActions}
            updateReadiness={updateReadiness}
            updatePosition={updatePosition}
            players={players.filter((p) => p.room == room)}
            room={rooms.find((r) => r.name === multiplayer.room)}
            rooms={rooms}
            resetGame={resetGame}
            multiplayer={multiplayer}
            setMultiplayer={setMultiplayer}
            setPlayers={setPlayers}
            setRooms={setRooms}
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
