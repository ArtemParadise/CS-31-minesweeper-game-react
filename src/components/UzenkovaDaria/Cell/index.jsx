import React from 'react';
import styles from './Cell.module.css'; 
import { CellState } from '../minesweeperLogic.js';

const Cell = React.memo(({ cellData, onClick, onContextMenu }) => {
  
  const getCellContent = () => {
    if (cellData.state === CellState.FLAGGED) return "🚩";
    if (cellData.state === CellState.OPEN) {
      if (cellData.hasMine) return "💣";
      if (cellData.adjacentMines > 0) return cellData.adjacentMines;
    }
    return null;
  };

  const getCellClassName = () => {
    let classNames = [styles.cell];

    if (cellData.state === CellState.CLOSED) {
      classNames.push(styles.cellClosed);
    } else if (cellData.state === CellState.FLAGGED) {
      classNames.push(styles.cellFlag);
    } else if (cellData.state === CellState.OPEN) {
      if (cellData.hasMine) {
        classNames.push(cellData.exploded ? styles.cellMineClicked : styles.cellMine);
      } else {
        classNames.push(styles.cellOpen);
        if (cellData.adjacentMines > 0) {
          classNames.push(styles[`cellNum${cellData.adjacentMines}`]);
        }
      }
    }
    return classNames.join(' ');
  };

  return (
    <div
      className={getCellClassName()}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {getCellContent()}
    </div>
  );
});

export default Cell;