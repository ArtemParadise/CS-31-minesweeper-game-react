import React from 'react';

function formatMineCount(count) {
  return String(Math.max(0, count)).padStart(3, '0');
}

function GameStatus({ remainingMines, styles }) {
  
  const classNames = [styles.gameBoardScore];
  if (remainingMines === 0) {
    classNames.push(styles.flagsEmpty);
  }

  return (
    <div className={classNames.join(' ')}>
      {formatMineCount(remainingMines)}
    </div>
  );
}

export default React.memo(GameStatus);