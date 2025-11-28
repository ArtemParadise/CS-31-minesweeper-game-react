import React from 'react';
import styles from './Game.module.css';

export default function Cell({ row, col, value, mine, revealed, flagged, onLeftClick, onRightClick }) {
  const classList = [styles.cell];
  if (revealed) classList.push(styles.revealed);
  if (flagged) classList.push(styles.flag);
  if (mine) classList.push(styles.mine);
  if (value > 0) classList.push(styles[`number-${value}`]);

  return (
    <div
      className={classList.join(' ')}
      data-row={row}
      data-col={col}
      onClick={onLeftClick}
      onContextMenu={onRightClick}
      role="button"
      tabIndex={0}
    />
  );
}
