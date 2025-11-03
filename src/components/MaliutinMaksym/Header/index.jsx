import React from 'react';
import Timer from '../Timer';
import styles from './Header.module.css';

const Header = ({ flagsLeft, gameStatus, onRestart }) => {
  
  const getButtonText = () => {
    if (gameStatus === 'won') return 'You Won!';
    if (gameStatus === 'lost') return 'Try Again';
    return 'Restart';
  };

  return (
    <header className={styles.gameBoardHeader}>
      <div className={styles.flagsLeft}>
        {String(flagsLeft).padStart(3, '0')}
      </div>
      <button className={styles.startButton} onClick={onRestart}>
        {getButtonText()}
      </button>
      <Timer gameStatus={gameStatus} />
    </header>
  );
};

export default Header;