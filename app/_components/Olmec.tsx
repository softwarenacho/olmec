import Image from 'next/image';
import { useState } from 'react';
import styles from '../_styles/Olmec.module.scss';
import Game from './Game';

const Olmec = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={styles.page}>
      <div className={styles.backgroundPattern}></div>
      <div className={styles.olmecHead}></div>
      <div className={styles.mainElement}>
        <h1 className={styles.title}>Olmec</h1>
        <Game />
        {/* <div className={styles.summary}>
          <Culture />
          <button className={styles.knowMoreButton}>Know More</button>
        </div> */}
      </div>
      <div className={styles.footer}>
        <div className={styles.pyramid}>
          <div className={styles.top}>
            <a>Game</a>
          </div>
          <div className={styles.middle}>
            <a>Rules</a>
            <a>History</a>
          </div>
          <div className={styles.bottom}>
            <a>More</a>
            <a>More</a>
            <a>More</a>
          </div>
        </div>
      </div>
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarContent}>
          <ul>
            <li>Game</li>
            <li>Rules</li>
            <li>History</li>
            <li>More</li>
          </ul>
        </div>
      </div>
      <div className={styles.sidebarToggle} onClick={toggleSidebar}>
        {sidebarOpen && (
          <Image
            src='/icons/basalt.webp'
            alt='Close Menu'
            width={32}
            height={32}
          />
        )}
        {!sidebarOpen && (
          <Image
            src='/icons/jade.webp'
            alt='Open Menu'
            width={32}
            height={32}
          />
        )}
      </div>
    </div>
  );
};

export default Olmec;
