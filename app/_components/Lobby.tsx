import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from '../_styles/Lobby.module.scss';
import { supabase } from '../_utils/supabaseClient';
import { Player } from './Multiplayer';

const Lobby = ({
  multiplayer,
  setGameStart,
  setMultiplayer,
  setGameReady,
  setPlayers,
  startGame,
  updatePosition,
  resetGame,
  players,
  rooms,
  room,
}: {
  multiplayer: Player;
  setGameStart: Dispatch<SetStateAction<boolean>>;
  setMultiplayer: Dispatch<SetStateAction<Player>>;
  setGameReady: Dispatch<SetStateAction<boolean>>;
  setPlayers: Dispatch<SetStateAction<any[]>>;
  updatePosition: (n: number) => void;
  resetGame: () => void;
  startGame: boolean;
  players: any[];
  rooms: any[];
  room: any;
}) => {
  const isOwner = room.owner === multiplayer.name;
  console.log('🚀 ~ room:', room, isOwner);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [showActions, setShowActions] = useState<boolean>(true);

  const updateReadiness = async (ready: boolean) => {
    console.log('🚀 ~ updateReadiness ~ ready:', ready);
    const { error } = await supabase
      .from('players')
      .update({ ready })
      .eq('name', multiplayer.name || '');
    console.log('🚀 ~ updateReadiness ~ error:', error);
    setMultiplayer({
      ...multiplayer,
      position: ready ? 1 : 0,
      ready: ready,
    });
    updatePosition(ready ? 1 : 0);
  };

  useEffect(() => {
    console.log('🚀 ~ useEffect ~ playerReady:', playerReady);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerReady]);

  useEffect(() => {
    const player = players.find((p) => multiplayer.name === p.name);
    if (player) {
      setPlayerReady(player.ready);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

  useEffect(() => {
    const channel = supabase.channel(multiplayer.room || 'default');
    // Subscribe to players
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'players' },
      (payload: any) => {
        console.log('🚀 ~ useEffect ~ payload:', payload);
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
      },
    );
    // Subscribe to room
    // channel.on(
    //   'postgres_changes',
    //   { event: '*', schema: 'public', table: 'rooms' },
    //   (payload: any) => {
    //     console.log('🚀 ~ useEffect ~ payload:', payload);
    //     const changed = rooms.filter((r) => r.name === payload.new.name);
    //     console.log('🚀 ~ useEffect ~ changed:', changed);
    //     const others = rooms.filter((p) => p.name !== payload.new.name);
    //     console.log('🚀 ~ useEffect ~ others:', others);
    //     // const updatedPlayer = {
    //     //   ...changed[0],
    //     //   avatar: payload.new.avatar,
    //     //   position: payload.new.position,
    //     //   ready: payload.new.ready,
    //     // };
    //     // const newPlayers = [...others, updatedPlayer];
    //     // setPlayers(newPlayers);
    //   },
    // );
    // eslin
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.lobby}>
      {isOwner && (
        <Image
          src='/icons/up.webp'
          alt='Toggle Menu'
          className={`${styles.caret} ${!showActions ? styles.down : ''}`}
          width={24}
          height={24}
          onClick={() => setShowActions(!showActions)}
        />
      )}
      <div
        className={`${styles.players} ${showActions ? '' : styles.minimized}`}
      >
        <div className={styles.head}>
          <p className={styles.names}>{multiplayer?.room}</p>
          {players.filter((player) => player.ready).length >= 2 && (
            <p className={styles.position}>
              <Image
                src='/icons/position.webp'
                alt='Players Position'
                width={24}
                height={24}
              />
            </p>
          )}
          {!startGame && <p className={styles.ready}>Status</p>}
        </div>
        {players
          .filter((p) => (showActions && !startGame ? true : p.ready))
          .map((player) => (
            <div className={styles.player} key={player.name}>
              <p className={styles.names}>
                <span>{player.name}</span>
                <Image
                  src={`/players/${player.avatar}`}
                  alt={`Avatar ${player.avatar}`}
                  width={32}
                  height={32}
                />
              </p>
              {players.filter((player) => player.ready).length >= 2 && (
                <p className={styles.position}>{player.position}</p>
              )}
              {!startGame && (
                <p className={styles.ready}>
                  {player.name === multiplayer.name ? (
                    <label className={styles.switch}>
                      <input
                        type='checkbox'
                        checked={multiplayer.ready}
                        onChange={() => {
                          updateReadiness(!multiplayer.ready);
                        }}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  ) : (
                    <span>{player.ready ? 'Ready' : 'Waiting'}</span>
                  )}
                </p>
              )}
            </div>
          ))}
      </div>
      {showActions && (
        <>
          {!startGame && !isOwner && (
            <p className={styles.wait}>Wait for owner to start</p>
          )}
          <div className={styles.actions}>
            {!startGame &&
              isOwner &&
              players.filter((player) => player.ready).length >= 2 && (
                <button
                  onClick={() => {
                    setGameStart(true);
                    setShowActions(false);
                  }}
                >
                  Start Game
                </button>
              )}
            {startGame && <button onClick={resetGame}>Reset Game</button>}
            <button
              className={styles.close}
              onClick={() => {
                setGameReady(false);
                setGameStart(false);
                updateReadiness(false);
              }}
            >
              {isOwner ? 'Close Room' : 'Exit Room'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Lobby;
