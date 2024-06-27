import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from '../_styles/Menu.module.scss';
import Culture from './Culture';
import Instructions from './Instructions';

const Menu = ({ resetBoard }: { resetBoard?: () => void }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [showCulture, setShowCulture] = useState<boolean>(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setShowCulture(false);
    setShowRules(false);
  };

  return (
    <>
      <div
        className={`${styles.sidebarToggle} ${sidebarOpen ? styles.open : ''}`}
        onClick={toggleSidebar}
      >
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
            <li
              onClick={() => {
                setShowRules(true);
                setShowCulture(false);
                setSidebarOpen(false);
              }}
            >
              <a>Game Rules</a>
              <Image
                src='/icons/pyramid.webp'
                alt='Pyramid'
                width={32}
                height={32}
              />
            </li>
            <li
              onClick={() => {
                setShowRules(false);
                setShowCulture(true);
                setSidebarOpen(false);
              }}
            >
              <a>Olmec Culture</a>
              <Image
                src='/icons/calendar.webp'
                alt='Calendar'
                width={32}
                height={32}
              />
            </li>
            {resetBoard && (
              <li onClick={resetBoard}>
                <a>Play Again</a>
                <Image
                  src='/icons/figure.webp'
                  alt='Jade Figure'
                  width={32}
                  height={32}
                />
              </li>
            )}
          </ul>
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
    </>
  );
};

export default Menu;
