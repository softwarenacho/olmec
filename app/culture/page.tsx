'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import Culture from '../_components/Culture';
import styles from '../_styles/Culture.module.scss';

const CulturePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className={styles.main}>
        <Culture />
        <Link href='/' role='button'>
          Go Back
        </Link>
      </main>
    </Suspense>
  );
};

export default CulturePage;
