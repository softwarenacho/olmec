'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import Culture from './_components/Culture';
import Instructions from './_components/Instructions';
import Menu from './_components/Menu';
import styles from './page.module.scss';

const Home = () => {
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showCulture, setShowCulture] = useState<boolean>(false);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className={styles.main}>
        <div className={styles.backgroundPattern}></div>
        <div className={styles.olmecHead}></div>
        <Menu />
        <div className={styles.mainElement}>
          <h1 className={styles.title}>Olmec</h1>
          <div className={styles.summary}>
            <p>
              Olmec is an exciting twist on the classic Snakes and Ladders game.
            </p>
            <p>
              In this version, you control the mighty Jaguar warrior, navigating
              your way to the top of the pyramid.
            </p>
            <p>
              Each game board is uniquely generated, providing a fresh challenge
              every time you play. Avoid the serpents that will drag you down
              and take advantage of the ladders to climb faster. Reach the top
              before the Eagle warrior to win the game!
            </p>
            <Link className={styles.knowMoreButton} href='/game' role='button'>
              Play Now
            </Link>
          </div>
        </div>
        {(showRules || showCulture) && (
          <div className={styles.modal}>
            {showRules && <Instructions />}
            {showCulture && <Culture />}
            <button
              className={styles.close}
              onClick={() => {
                setShowRules(false);
                setShowCulture(false);
              }}
            >
              Close
            </button>
          </div>
        )}
        <div className={styles.footer}>
          <div className={styles.pyramid}>
            <div className={styles.top}>
              <Link href='/game' role='button'>
                Game
              </Link>
            </div>
            <div className={styles.middle}>
              <a
                onClick={() => {
                  setShowRules(true);
                  setShowCulture(false);
                }}
              >
                Rules
              </a>
              <a
                onClick={() => {
                  setShowRules(false);
                  setShowCulture(true);
                }}
              >
                Culture
              </a>
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  );
};

export default Home;
