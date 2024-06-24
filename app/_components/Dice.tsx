import React, { useEffect, useState } from 'react';
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
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (resetDice) {
      setResult(null);
      setCountdown(null);
    }
  }, [resetDice]);

  useEffect(() => {
    if (result !== null) {
      setCountdown(result);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev === 1) {
            clearInterval(interval);
            return null;
          }
          return prev! - 1;
        });
      }, 500);
    }
  }, [result]);

  const handleRoll = () => {
    setRolling(true);
    setTimeout(() => {
      const rollResult = Math.floor(Math.random() * 6) + 1;
      setResult(rollResult);
      setRolling(false);
      rollDice(rollResult);
    }, 500);
  };

  let buttonText;
  if (rolling) {
    buttonText = 'Rolling...';
  } else if (countdown !== null) {
    buttonText = `${countdown}`;
  } else if (playerIsMoving) {
    buttonText = 'Moving...';
  } else if (aiIsMoving) {
    buttonText = 'Wait...';
  } else {
    buttonText = 'Roll Dice';
  }

  return (
    <button
      className={styles.dice}
      onClick={handleRoll}
      disabled={rolling || countdown !== null || playerIsMoving || aiIsMoving}
    >
      {buttonText}
    </button>
  );
};

export default Dice;
