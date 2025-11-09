import React from 'react';
import styles from './Minesweeper.module.css';

function GameOverModal({ onRestart }) {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Game Over!</h2>
        <h4>You hit a bomb!</h4>
        <button onClick={onRestart}>Restart Game</button>
      </div>
    </div>
  );
}

export default GameOverModal;
