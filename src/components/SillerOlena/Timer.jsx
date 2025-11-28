import React from 'react';
import styles from './Minesweeper.module.css';

function Timer({ seconds }) {
  return <div id="timer" className={styles.timer}>⏱ Time: {seconds}s</div>;
}

export default Timer;
