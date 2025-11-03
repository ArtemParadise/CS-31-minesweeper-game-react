import React from 'react';
import styles from './Cell.module.css';
import { CELL_STATE } from '../../../pages/MaliutinMaksym/gameLogic'; // Імпортуємо з логіки

const Cell = React.memo(({ cellData, onClick, onContextMenu }) => {
  
  const getCellContent = () => {
    if (cellData.state === CELL_STATE.OPEN) {
      if (cellData.hasMine) {
        return '💣';
      }
      if (cellData.neighborCount > 0) {
        return cellData.neighborCount;
      }
    }
    if (cellData.state === CELL_STATE.FLAGGED) {
      return '🚩';
    }
    return '';
  };

  const getCellClassName = () => {
    let className = styles.cell;

    switch (cellData.state) {
      case CELL_STATE.CLOSED:
        className += ` ${styles.closed}`;
        break;
      case CELL_STATE.OPEN:
        className += ` ${styles.open}`;
        if (cellData.hasMine) {
          className += ` ${styles.mine}`;
        } else if (cellData.neighborCount > 0) {
          className += ` ${styles[`number${cellData.neighborCount}`]}`;
        }
        break;
      case CELL_STATE.FLAGGED:
        className += ` ${styles.flagged}`;
        break;
      default:
        break;
    }
    return className;
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