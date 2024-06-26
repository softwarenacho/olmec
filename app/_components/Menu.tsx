import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useState } from 'react';
import styles from '../_styles/Menu.module.scss';

const Menu = ({ resetBoard }: { resetBoard?: () => void }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
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
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarContent}>
          <ul>
            <li>
              {pathname !== '/game' ? (
                <Link href='/game' role='button'>
                  Play Game
                </Link>
              ) : (
                <Link href='/' role='button'>
                  Home
                </Link>
              )}
              <Image
                src='/icons/head.webp'
                alt='Olmec Head'
                width={32}
                height={32}
              />
            </li>
            <li>
              <Link href='/rules' role='button'>
                Game Rules
              </Link>
              <Image
                src='/icons/pyramid.webp'
                alt='Pyramid'
                width={32}
                height={32}
              />
            </li>
            <li>
              <Link href='/culture' role='button'>
                Olmec Culture
              </Link>
              <Image
                src='/icons/calendar.webp'
                alt='Calendar'
                width={32}
                height={32}
              />
            </li>
            {resetBoard && (
              <li onClick={resetBoard}>
                <a>Reset Board</a>
                <Image
                  src='/icons/Figure.webp'
                  alt='Jade Figure'
                  width={32}
                  height={32}
                />
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Menu;
