import React from 'react';
import Timer from '../Timer';
import styles from './Header.module.css';
import { GAME_STATUS } from '../../../core/MaliutinMaksym/constants.js';

const Header = ({ flagsLeft, gameStatus, onRestart }) => {
  
  const getButtonText = () => {
    if (gameStatus === GAME_STATUS.WON) return 'You Won!';
    if (gameStatus === GAME_STATUS.LOST) return 'Try Again';
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