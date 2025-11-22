import styles from '../styles/Timer.module.css';

function formatTime(seconds) {
  const clampedValue = Math.min(Math.max(seconds, 0), 999);
  return String(clampedValue).padStart(3, '0');
}

function Timer({ seconds }) {
  return (
    <div className={styles.timer}>
      {formatTime(seconds)}
    </div>
  );
}

export default Timer;