import Timer from '../Timer';
import styles from './Header.module.css';
import { GAME_STATUS } from '../utils';

export default function Header({ flagsLeft, time, setTime, status, restart }) {
  return (
    <div className={styles.topPanel}>
      <div className={styles.flags}>
        🚩 {flagsLeft.toString().padStart(2, '0')}
      </div>

      <button className={styles.button} onClick={restart}>
        {/* 👇 ИСПОЛЬЗУЕМ КОНСТАНТУ ВМЕСТО СТРОКИ 'playing' */}
        {status === GAME_STATUS.PLAYING ? 'Start' : 'Restart'}
      </button>

      <Timer time={time} setTime={setTime} status={status} />
    </div>
  );
}