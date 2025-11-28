import React from 'react';
import styles from './Game.module.css';

export default function ResetButton({ status = 'idle', onClick }) {
  const cls = [styles.resetButton];
  if (status === 'win') cls.push(styles.win);
  if (status === 'loss') cls.push(styles.loss);
  if (status === 'playing') cls.push(styles.scared);
  return (
    <button id="reset-button" className={cls.join(' ')} onClick={onClick} />
  );
}
