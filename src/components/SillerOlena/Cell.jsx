import React from 'react';
import styles from './Minesweeper.module.css';

function Cell({ value, revealed, flagged, onClick, onRightClick }) {
  let display = '';
  let className = styles.cell;

  if (revealed) {
    className += ` ${styles.revealed}`;
    display = value === 'M' ? '💣' : value > 0 ? value : '';
  } else if (flagged) {
    className += ` ${styles.flagged}`;
    display = '🚩';
  }

  return (
    <div className={className} onClick={onClick} onContextMenu={onRightClick}>
      {display}
    </div>
  );
}

export default Cell;
