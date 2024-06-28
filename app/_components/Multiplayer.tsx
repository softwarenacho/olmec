import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import styles from '../_styles/Multiplayer.module.scss';

export interface Player {
  name?: string;
  room?: string;
  avatar?: string;
}

interface MultiplayerInterface {
  avatar: string;
  setAvatar: Dispatch<SetStateAction<string>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  room: string;
  setRoom: Dispatch<SetStateAction<string>>;
  setMultiplayer: Dispatch<SetStateAction<Player>>;
  setGameReady: Dispatch<SetStateAction<boolean>>;
}

const Multiplayer = ({
  avatar,
  setAvatar,
  name,
  setName,
  room,
  setRoom,
  setMultiplayer,
  setGameReady,
}: MultiplayerInterface) => {
  const images = [
    'jaguar.webp',
    'eagle.webp',
    'deer.webp',
    'dog.webp',
    'ocelotl.webp',
    'lizard.webp',
    'turtle.webp',
    'sun.webp',
    'statue.webp',
    'totem.webp',
    'calendar.webp',
    'head.webp',
    'kunz.webp',
    'mask.webp',
    'chac.webp',
    'ehecatl.webp',
    'malinalli.webp',
    'mictlantecuhtli.webp',
    'miquiztli.webp',
    'ozomathli.webp',
    'tumi.webp',
    'cuauhtli.webp',
    'itzcuintli.webp',
    'quetzalcoatl.webp',
    'tlaloc.webp',
    'olmecan.webp',
    'maya.webp',
  ];

  const [changeAvatar, setChangeAvatar] = useState<boolean>(false);

  const createOrConnect = () => {
    setMultiplayer({
      name,
      room,
      avatar,
    });
    setGameReady(true);
  };

  return (
    <section className={styles.multi}>
      <Image
        className={styles.top}
        src={`/icons/teotihuacan.webp`}
        alt={`Teotihuacan`}
        width={48}
        height={48}
        priority
      />
      <div className={styles.inputs}>
        <label>
          <div className={styles.decorated}>
            <Image
              className={styles.wall}
              src={`/icons/wall-basalt.webp`}
              alt={`Wall Basalt`}
              width={32}
              height={32}
            />
            <input
              type='text'
              value={room}
              onChange={(e) => {
                setRoom(e.target.value);
              }}
            />
          </div>
          <span>Room Name</span>
        </label>
        <label
          onClick={() => setChangeAvatar(!changeAvatar)}
          className={changeAvatar ? styles.change : ''}
        >
          <Image
            className={styles.selected}
            src={`/players/${avatar}`}
            alt={`Player ${avatar}`}
            width={48}
            height={48}
            priority
          />
          <span>Avatar</span>
        </label>
        <label>
          <div className={styles.decorated}>
            <Image
              className={styles.wall}
              src={`/icons/wall-jade.webp`}
              alt={`Wall Jade`}
              width={32}
              height={32}
            />
            <input
              type='text'
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <span>Player Name</span>
        </label>
      </div>
      {changeAvatar && (
        <div className={styles.players}>
          {images.map((image: string) => (
            <Image
              key={image}
              className={avatar === image ? styles.selected : ''}
              src={`/players/${image}`}
              alt={`Avatar ${image}`}
              onClick={() => {
                setAvatar(image);
                setChangeAvatar(false);
              }}
              width={64}
              height={64}
            />
          ))}
        </div>
      )}
      {(!name || !room) && <div className={styles.base}></div>}
      {name && room && (
        <div className={styles.actions}>
          <button
            onClick={() => {
              createOrConnect();
            }}
          >
            Start Game
          </button>
        </div>
      )}
    </section>
  );
};

export default Multiplayer;
