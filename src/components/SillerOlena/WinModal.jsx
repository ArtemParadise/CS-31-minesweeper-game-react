import React from 'react';
import styles from './Minesweeper.module.css';

function WinModal({ onRestart }) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>You Win!</h2>
        <h4>You cleared the board!</h4>
        <button onClick={onRestart}>Restart Game</button>
      </div>
    </div>
  );
}

export default WinModal;
