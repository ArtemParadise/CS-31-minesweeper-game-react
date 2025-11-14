import React from 'react';
import styles from './Minesweeper.module.css';

function StatusBar({ bombs, flags, time }) {
  return (
    <div className={styles.statusBar}>
      <div>🚩 Flags: {flags} / {bombs}</div>
      <div>⏱ Time: {time}s</div>
    </div>
  );
}

export default StatusBar;
