import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from '../_styles/Lobby.module.scss';
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
  // console.log('🚀 ~ players:', players);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [showActions, setShowActions] = useState<boolean>(true);

  useEffect(() => {
    if (playerReady) {
      setMultiplayer({
        ...multiplayer,
        position: 1,
        ready: true,
      });
    } else {
      setMultiplayer({
        ...multiplayer,
        position: 0,
        ready: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerReady]);

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
      <div className={styles.players}>
        <div className={styles.head}>
          <p className={styles.names}>{multiplayer?.room}</p>
          {!startGame && <p className={styles.ready}>Status</p>}
          {players.every((player) => player.position) && (
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
        {players.map((player) => (
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
                        setPlayerReady(e.target.checked);
                      }}
                    />
                    <span className={styles.slider}></span>
                  </label>
                ) : (
                  <span>{player.ready ? 'Ready' : 'Waiting'}</span>
                )}
              </p>
            )}
            {players.every((player) => player.position) && (
              <p className={styles.position}>{player.position}</p>
            )}
          </div>
        ))}
      </div>
      {showActions && (
        <>
          <div className={styles.actions}>
            {!startGame && players.every((player) => player.ready) && (
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
