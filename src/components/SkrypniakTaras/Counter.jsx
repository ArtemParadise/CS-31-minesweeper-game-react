import React from 'react';
import styles from './Game.module.css';

export default function Counter({ value }) {
  let v = Math.max(-99, Math.min(999, value)); // clamp
  let absv = Math.abs(v);
  const digits = [
    Math.floor(absv / 100) % 10,
    Math.floor(absv / 10) % 10,
    absv % 10
  ];

  // if negative, show minus in the hundreds place
  const hundredClass = v < 0 ? styles['digit-dash'] : styles[`digit-${digits[0]}`];

  return (
    <div className={styles.counter}>
      <div className={`${styles.digit} ${hundredClass}`} />
      <div className={`${styles.digit} ${styles[`digit-${digits[1]}`]}`} />
      <div className={`${styles.digit} ${styles[`digit-${digits[2]}`]}`} />
    </div>
  );
}
