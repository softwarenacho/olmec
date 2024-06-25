'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import Instructions from '../_components/Instructions';
import styles from '../_styles/Instructions.module.scss';

const RulesPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className={styles.main}>
        <Instructions />
        <Link href='/' role='button'>
          Go Back
        </Link>
      </main>
    </Suspense>
  );
};

export default RulesPage;
