'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import Menu from './_components/Menu';
import styles from './page.module.scss';

const Home = () => {
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
        <div className={styles.footer}>
          <div className={styles.pyramid}>
            <div className={styles.top}>
              <Link href='/game' role='button'>
                Game
              </Link>
            </div>
            <div className={styles.middle}>
              <Link href='/rules' role='button'>
                Rules
              </Link>
              <Link href='/culture' role='button'>
                Culture
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Suspense>
  );
};

export default Home;
