import styles from '../styles/Cell.module.css';

function Cell({ cell, onLeftClick, onRightClick, onDoubleClick }) {
  const handleClick = () => {
    onLeftClick(cell.rowIndex, cell.columnIndex);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    onRightClick(cell.rowIndex, cell.columnIndex);
  };

  const handleDoubleClick = () => {
    onDoubleClick(cell.rowIndex, cell.columnIndex);
  };

  let cellClassName = styles.cell;
  let content = '';

  if (cell.isRevealed) {
    cellClassName = `${styles.cell} ${styles.cellRevealed}`;

    if (cell.hasMine) {
      cellClassName = `${styles.cell} ${styles.cellMine}`;
      content = '💣';
    } else if (cell.adjacentMinesCount > 0) {
      const numberClassName =
        styles[`cellNumber${cell.adjacentMinesCount}`] ?? '';
      cellClassName = `${styles.cell} ${styles.cellRevealed} ${numberClassName}`;
      content = cell.adjacentMinesCount;
    }
  } else if (cell.isFlagged) {
    cellClassName = `${styles.cell} ${styles.cellFlag}`;
    content = '🚩';
  }

  return (
    <div
      className={cellClassName}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
    >
      {content}
    </div>
  );
}

export default Cell;