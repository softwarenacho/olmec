import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import styles from '../_styles/Dice.module.scss';

interface DiceProps {
  rollDice: (result: number) => void;
  resetDice: boolean;
  playerIsMoving: boolean;
  aiIsMoving: boolean;
}

const Dice: React.FC<DiceProps> = ({
  rollDice,
  resetDice,
  playerIsMoving,
  aiIsMoving,
}) => {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const resultRef = useRef<number | null>(null);

  useEffect(() => {
    if (resetDice) {
      setResult(null);
    }
  }, [resetDice]);

  useEffect(() => {
    if (rolling) {
      const rollInterval = setInterval(() => {
        const rollResult = Math.floor(Math.random() * 6) + 1;
        resultRef.current = rollResult;
        setResult(rollResult);
      }, 50);

      setTimeout(() => {
        clearInterval(rollInterval);
        setRolling(false);
        rollDice(resultRef.current!);
      }, 1000);

      return () => clearInterval(rollInterval);
    }
  }, [rolling, rollDice]);

  const handleRoll = () => {
    setRolling(true);
  };

  let diceSrc;
  if (rolling) {
    diceSrc = `/icons/dice${result ? `-${result}` : ''}.webp`;
  } else if (result !== null) {
    diceSrc = `/icons/dice-${result}.webp`;
  } else {
    diceSrc = '/icons/dice.webp';
  }

  let statusText;
  if (rolling) {
    statusText = 'Rolling';
  } else if (playerIsMoving) {
    statusText = 'Moving';
  } else if (aiIsMoving) {
    statusText = 'Wait';
  } else {
    statusText = 'Roll';
  }

  return (
    <div className={styles.diceContainer}>
      <Image
        priority
        src={diceSrc}
        alt={statusText}
        width={50}
        height={50}
        className={`${styles.dice} ${rolling ? styles.rolling : ''}`}
        onClick={
          !rolling && !playerIsMoving && !aiIsMoving ? handleRoll : undefined
        }
      />
      <div className={styles.statusText}>{statusText}</div>
    </div>
  );
};

export default Dice;
