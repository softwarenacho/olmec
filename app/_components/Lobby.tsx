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
  startGame,
  resetGame,
  players,
}: {
  multiplayer: Player;
  setGameStart: Dispatch<SetStateAction<boolean>>;
  setMultiplayer: Dispatch<SetStateAction<Player>>;
  setGameReady: Dispatch<SetStateAction<boolean>>;
  resetGame: () => void;
  startGame: boolean;
  players: any[];
}) => {
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [showActions, setShowActions] = useState<boolean>(true);

  const updateReadiness = async (ready: boolean) => {
    const { error } = await supabase
      .from('players')
      .update({ ready })
      .eq('name', multiplayer.name || '');
    if (!error) {
      setPlayerReady(ready);
    }
  };

  useEffect(() => {
    setMultiplayer({
      ...multiplayer,
      position: playerReady ? 1 : 0,
      ready: playerReady,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerReady]);

  useEffect(() => {
    const player = players.find((p) => multiplayer.name === p.name);
    if (player) {
      setPlayerReady(player.ready);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

  return (
    <div className={styles.lobby}>
      <Image
        src='/icons/up.webp'
        alt='Toggle Menu'
        className={`${styles.caret} ${!showActions ? styles.down : ''}`}
        width={24}
        height={24}
        onClick={() => setShowActions(!showActions)}
      />
      <div
        className={`${styles.players} ${showActions ? '' : styles.minimized}`}
      >
        <div className={styles.head}>
          <p className={styles.names}>{multiplayer?.room}</p>
          {!startGame && <p className={styles.ready}>Status</p>}
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
        </div>
        {players
          .filter((p) => (showActions && !startGame ? true : p.ready))
          .map((player) => (
            <div className={styles.player} key={player.name}>
              <p className={styles.names}>
                <Image
                  src={`/players/${player.avatar}`}
                  alt={`Avatar ${player.avatar}`}
                  width={32}
                  height={32}
                />
                <span>{player.name}</span>
              </p>
              {!startGame && (
                <p className={styles.ready}>
                  {player.name === multiplayer.name ? (
                    <label className={styles.switch}>
                      <input
                        type='checkbox'
                        checked={playerReady}
                        onChange={(e) => {
                          updateReadiness(e.target.checked);
                        }}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  ) : (
                    <span>{player.ready ? 'Ready' : 'Waiting'}</span>
                  )}
                </p>
              )}
              {players.filter((player) => player.ready).length >= 2 && (
                <p className={styles.position}>{player.position}</p>
              )}
            </div>
          ))}
      </div>
      {showActions && (
        <>
          <div className={styles.actions}>
            {!startGame &&
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
              }}
            >
              Close Room
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Lobby;
