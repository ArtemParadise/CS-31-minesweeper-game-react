import styles from './MineCounter.module.css';

export default function MineCounter({ minesRemaining }) {
  const formatCount = (count) => {
    return String(Math.max(0, count)).padStart(3, '0');
  };

  return (
    <div className={styles.counter}>
      {formatCount(minesRemaining)}
    </div>
  );
}
