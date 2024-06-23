'use client';

import { Suspense, useEffect, useState } from 'react';
import Olmec from './_components/Olmec';
import styles from './page.module.scss';

const Home = () => {
  const [loadImages, setImages] = useState(false);
  useEffect(() => {
    setImages(true);
  }, []);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className={styles.main}>
        <Olmec />
      </main>
    </Suspense>
  );
};

export default Home;
