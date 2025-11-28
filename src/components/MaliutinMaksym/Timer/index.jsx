import React, { useState, useEffect, useRef } from 'react';
import styles from './Timer.module.css';

// Форматуємо час ММ:СС
function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

const Timer = ({ gameStatus }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerIdRef = useRef(null);

  useEffect(() => {
    // Починаємо таймер, коли гра починається
    if (gameStatus === 'playing') {
      if (timerIdRef.current) return; // Вже запущено
      timerIdRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    } 
    // Зупиняємо таймер, якщо гра виграна або програна
    else if (gameStatus === 'won' || gameStatus === 'lost') {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    } 
    // Скидаємо таймер, якщо гра в стані "ready" (після рестарту)
    else if (gameStatus === 'ready') {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
      setElapsedTime(0);
    }

    // Очищення при розмонтуванні
    return () => {
      clearInterval(timerIdRef.current);
    };
  }, [gameStatus]);

  return (
    <div className={styles.timer}>
      {formatTime(elapsedTime)}
    </div>
  );
};

export default Timer;