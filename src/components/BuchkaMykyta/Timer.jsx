import styles from './Timer.module.css';

export default function Timer({ seconds }) {
  const formatTime = (s) => {
    return String(Math.min(s, 999)).padStart(3, '0');
  };

  return (
    <div className={styles.counter}>
      {formatTime(seconds)}
    </div>
  );
}
