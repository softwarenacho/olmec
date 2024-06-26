import styles from '../_styles/Instructions.module.scss';

const Instructions = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.subtitle}>How to Play Olmec</h2>
      <ol className={styles.instructions}>
        <li>
          Click on the &quot;Roll Dice&quot; button to roll the dice and get a
          number between 1 and 6.
        </li>
        <li>
          Move your Jaguar warrior forward according to the number you rolled.
        </li>
        <li>
          If you land on a ladder, your warrior will automatically move up to
          the ladder&apos;s end tile.
        </li>
        <li>
          If you land on a snake, your warrior will automatically slide down to
          the snake&apos;s end tile.
        </li>
        <li>The first player to reach the top of the pyramid wins the game.</li>
        <li>
          Each game board is randomly generated, ensuring a unique experience
          every time.
        </li>
        <li>Good luck and enjoy your journey to the top of the pyramid!</li>
      </ol>
    </div>
  );
};

export default Instructions;
