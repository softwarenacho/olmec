import Image from 'next/image';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import styles from '../_styles/Multiplayer.module.scss';
import { supabase } from '../_utils/supabaseClient';

export interface Player {
  name?: string;
  room?: string;
  avatar?: string;
  ready?: boolean;
  position?: number;
}

interface MultiplayerInterface {
  avatar: string;
  setAvatar: Dispatch<SetStateAction<string>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  rooms: any[];
  setRooms: Dispatch<SetStateAction<any[]>>;
  players: any[];
  setPlayers: Dispatch<SetStateAction<any[]>>;
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
  rooms,
  room,
  players,
  setRoom,
  setRooms,
  setPlayers,
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

  const roomExists = useCallback(() => {
    return rooms.find((r) => r.name === room);
  }, [room, rooms]);

  const playerExists = useCallback(
    (n: string) => {
      return players.find((p: any) => p.name === n);
    },
    [players],
  );

  const createRoom = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .insert({ name: room, owner: name })
      .select();
    if (!error) {
      setRooms(data);
      setBase();
    } else {
      alert('ERROR CREATING ROOM');
    }
  };

  const createPlayer = async () => {
    const { data, error } = await supabase
      .from('players')
      .insert({ name, avatar, position: 0, room, ready: false })
      .select();
    if (!error) {
      setPlayers([...players, data]);
    } else {
      alert('ERROR CREATING PLAYER');
    }
  };

  const updatePlayer = async () => {
    const { data, error } = await supabase
      .from('players')
      .update({ room, avatar })
      .eq('name', name)
      .select();
    if (!error) {
      const filterPlayers = players.filter((p) => p.name !== name);
      setPlayers([...filterPlayers, data[0]]);
    } else {
      alert('ERROR SELECTING PLAYER');
    }
  };

  const handlePlayer = async () => {
    if (!playerExists(name)) {
      createPlayer();
    } else {
      updatePlayer();
    }
  };

  const setBase = () => {
    setMultiplayer({
      name,
      room,
      avatar,
      ready: false,
      position: 0,
    });
    setGameReady(true);
  };

  const createOrConnect = async () => {
    handlePlayer();
    if (roomExists()) {
      setBase();
    } else {
      createRoom();
    }
  };

  useEffect(() => {
    const player = playerExists(name);
    if (player) {
      setAvatar(player.avatar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return (
    <section className={styles.multi}>
      <Image
        className={styles.top}
        src={`/icons/water.webp`}
        alt={`Water`}
        width={48}
        height={48}
        priority
      />
      <div className={styles.inputs}>
        <label>
          <div
            className={`${styles.left} ${roomExists() ? styles.exists : ''}`}
          >
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
          <div
            className={`${styles.right} ${
              playerExists(name) ? styles.exists : ''
            }`}
          >
            <input
              type='text'
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <Image
              className={styles.wall}
              src={`/icons/wall-jade.webp`}
              alt={`Wall Jade`}
              width={32}
              height={32}
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
          <button onClick={createOrConnect}>
            {roomExists() ? 'Connect to Room' : 'Create Room'}
          </button>
        </div>
      )}
    </section>
  );
};

export default Multiplayer;
