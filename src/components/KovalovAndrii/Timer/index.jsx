import { useEffect } from 'react';
import styles from './Timer.module.css';
import { GAME_STATUS } from '../utils';

export default function Timer({ time, setTime, status }) {
  useEffect(() => {
    if (status !== GAME_STATUS.PLAYING) {
      return;
    }

    const intervalId = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    // Очистка интервала
    return () => clearInterval(intervalId);
  }, [status, setTime]);

  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (time % 60).toString().padStart(2, '0');

  return (
    <div className={styles.timer}>
      ⏱ {minutes}:{seconds}
    </div>
  );
}