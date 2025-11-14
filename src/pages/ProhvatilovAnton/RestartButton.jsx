import React from 'react';

function RestartButton({ onRestart, gameState, styles }) {
  let emoji = '😊';
  if (gameState === 'victory') {
    emoji = '😎';
  } else if (gameState === 'defeat') {
    emoji = '😵';
  }
  
  return (
    <button className={styles.gameBoardButton} onClick={onRestart}>
      {emoji}
    </button>
  );
}

export default React.memo(RestartButton);