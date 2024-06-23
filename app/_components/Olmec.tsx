import { useState } from 'react';
import styles from '../_styles/Olmec.module.scss';
import Culture from './Culture';

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
        <h1 className={styles.title}>Olmecs</h1>
        <div className={styles.summary}>
          <Culture />
          <button className={styles.knowMoreButton}>Know More</button>
        </div>
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
            <li>About</li>
            <li>Settings</li>
            <li>Profile</li>
          </ul>
        </div>
      </div>
      <div className={styles.sidebarToggle} onClick={toggleSidebar}>
        menu
      </div>
    </div>
  );
};

export default Olmec;
