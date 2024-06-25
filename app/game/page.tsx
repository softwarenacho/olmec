'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import Game from '../_components/Game';
import styles from '../_styles/Game.module.scss';

const GamePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className={styles.main}>
        <Game />
        <Link href='/' role='button'>
          Go Home
        </Link>
      </main>
    </Suspense>
  );
};

export default GamePage;
