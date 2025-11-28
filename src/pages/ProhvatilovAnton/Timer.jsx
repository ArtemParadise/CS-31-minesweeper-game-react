import React from 'react';

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

function Timer({ time, styles }) {
  return (
    <div className={styles.gameBoardTimer}>
      {formatTime(time)}
    </div>
  );
}

export default React.memo(Timer);