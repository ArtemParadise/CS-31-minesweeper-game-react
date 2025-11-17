import Timer from '../Timer';
import styles from './Header.module.css';

export default function Header({
  flagsLeft,
  time,
  setTime,
  status,
  restart,
}) {
  return (
    <div className={styles.topPanel}>
      <div className={styles.flags}>🚩 {flagsLeft.toString().padStart(2, '0')}</div>

      <button className={styles.button} onClick={restart}>
        {status === 'playing' ? 'Start' : 'Restart'}
      </button>

      <Timer time={time} setTime={setTime} status={status} />
    </div>
  );
}