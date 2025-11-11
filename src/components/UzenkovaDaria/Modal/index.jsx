import React from 'react';
import styles from './Modal.module.css';
import { GameStatus, formatTime } from '../minesweeperLogic.js';

const Modal = ({ game, seconds, onRestart, onClose }) => {
  if (game.status !== GameStatus.WIN && game.status !== GameStatus.LOSE) {
    return null;
  }

  const isWin = game.status === GameStatus.WIN;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalWindow}>
        <h2>{isWin ? "🎉 You Win!" : "💥 You Lose!"}</h2>
        <p>⏱ Time: <b>{formatTime(seconds)}</b></p>
        <p>🚩 Flags remaining: <b>{game.flagsLeft}</b> / {game.mines}</p>
        <div style={{ marginTop: '12px' }}>
          <button className={styles.modalBtnRestart} onClick={onRestart}>
            🔄 Restart
          </button>
          <button className={styles.modalBtnClose} style={{ marginLeft: '8px' }} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;