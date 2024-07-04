import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import styles from '../_styles/Lobby.module.scss';
import { Player } from './Multiplayer';

const Lobby = ({
  multiplayer,
  showActions,
  setShowActions,
  setGameStart,
  setMultiplayer,
  setGameReady,
  setPlayers,
  startGame,
  setRooms,
  updatePosition,
  resetGame,
  updateReadiness,
  players,
  rooms,
  room,
}: {
  multiplayer: Player;
  showActions: boolean;
  setShowActions: Dispatch<SetStateAction<boolean>>;
  setGameStart: Dispatch<SetStateAction<boolean>>;
  setMultiplayer: Dispatch<SetStateAction<Player>>;
  setGameReady: Dispatch<SetStateAction<boolean>>;
  setPlayers: Dispatch<SetStateAction<any[]>>;
  setRooms: Dispatch<SetStateAction<any[]>>;
  updatePosition: (n: number) => void;
  resetGame: () => void;
  updateReadiness: (ready: boolean) => void;
  startGame: boolean;
  players: any[];
  rooms: any[];
  room: any;
}) => {
  const isOwner = room.owner === multiplayer.name;

  const sort = (a: any, b: any) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  };

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
          .sort(sort)
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
            {!startGame && isOwner && (
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
