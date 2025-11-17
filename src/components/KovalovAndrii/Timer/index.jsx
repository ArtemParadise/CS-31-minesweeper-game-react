import { useEffect } from 'react';
import styles from './Timer.module.css';

export default function Timer({ time, setTime, status }) {
  useEffect(() => {
    // Запускаем таймер, только если игра идет
    if (status !== 'playing') {
      return;
    }

    const intervalId = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    // Очистка интервала при размонтировании или остановке игры
    return () => clearInterval(intervalId);
  }, [status, setTime]); // Перезапускаем эффект, если меняется статус игры

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