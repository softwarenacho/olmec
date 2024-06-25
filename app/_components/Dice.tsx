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
  const resultRef = useRef<number | null>(null); // Ref to hold the current rolling result

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
      }, 100);

      setTimeout(() => {
        clearInterval(rollInterval);
        setRolling(false);
        rollDice(resultRef.current!);
      }, 3000);

      return () => clearInterval(rollInterval);
    }
  }, [rolling, rollDice]);

  const handleRoll = () => {
    setRolling(true);
  };

  let displayImageSrc;
  if (rolling) {
    displayImageSrc = `/icons/dice-${result}.png`;
  } else if (result !== null) {
    displayImageSrc = `/icons/dice-${result}.png`;
  } else {
    displayImageSrc = '/icons/dice.png';
  }

  let statusText;
  if (rolling) {
    statusText = 'Rolling...';
  } else if (playerIsMoving) {
    statusText = 'Moving...';
  } else if (aiIsMoving) {
    statusText = 'Wait...';
  } else {
    statusText = 'Roll Dice';
  }

  return (
    <div className={styles.diceContainer}>
      <Image
        src={displayImageSrc}
        alt={statusText}
        width={100}
        height={100}
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
