import Image from 'next/image';
import styles from '../_styles/Instructions.module.scss';

const Instructions = () => {
  return (
    <div className={styles.container}>
      <Image src='/icons/olmec.png' alt='Olmec Head' width={64} height={64} />
      <h2 className={styles.subtitle}>How to Play Olmec</h2>
      <ol className={styles.instructions}>
        <li>
          <Image src='/icons/dice-6.webp' alt='Dice' width={48} height={48} />
          Click on the Dice to roll it and get a number between 1 and 6.
        </li>
        <li>
          <Image src='/icons/jaguar.webp' alt='Jaguar' width={48} height={48} />
          Your Jaguar warrior will move forward according to the number you
          rolled.
        </li>
        <li>
          <Image
            className={styles.bg}
            src='/icons/stair.webp'
            alt='Stair'
            width={48}
            height={48}
          />
          If you land on a ladder, your warrior will automatically move up to
          the ladder&apos;s end tile.
        </li>
        <li>
          <Image
            src='/icons/snake.webp'
            className={styles.snake}
            alt='Snake'
            width={48}
            height={48}
          />
          If you land on a snake, your warrior will automatically slide down to
          the snake&apos;s end tile.
        </li>
        <Image src='/icons/pyramid.webp' alt='Pyramid' width={48} height={48} />
        <li>The first player to reach the top of the pyramid wins the game.</li>
        <li>
          Each game board is randomly generated, ensuring a unique experience
          every time.
        </li>
        <li>
          <b>Good luck and enjoy your journey to the top of the pyramid!</b>
        </li>
      </ol>
    </div>
  );
};

export default Instructions;
