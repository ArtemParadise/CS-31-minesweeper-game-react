import React from 'react';

function Cell({ cellData, onClick, onRightClick, styles }) {
  const { state, hasMine, adjacentMines } = cellData;

  let content = '';
  if (state === 'flagged') {
    content = '🚩';
  } else if (state === 'open') {
    if (hasMine) {
      content = '💣';
    } else if (adjacentMines > 0) {
      content = adjacentMines;
    }
  }

  const classNames = [styles.cell]; 

  if (state === 'closed') {
    classNames.push(styles.closed);
  } else if (state === 'flagged') {
    classNames.push(styles.flag);
  } else if (state === 'open') {
    if (hasMine) {
      classNames.push(styles.mine);
    } else if (adjacentMines > 0) {
      classNames.push(styles[`number${adjacentMines}`]);
    } else {
      classNames.push(styles.open);
    }
  }

  return (
    <div
      className={classNames.join(' ')}
      onClick={onClick}
      onContextMenu={onRightClick}
    >
      {content}
    </div>
  );
}

export default React.memo(Cell);