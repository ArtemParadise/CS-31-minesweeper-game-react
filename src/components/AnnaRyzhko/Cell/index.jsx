import React, { memo } from 'react';
import styles from './Cell.module.css';
import { CellState } from '../minesweeperLogic.js'; // Виправлений шлях

/**
 * Компонент, що відображає одну клітинку поля Minesweeper.
 */
const Cell = memo(({ cellData, row, col, onCellClick, onCellRightClick }) => {
    const { state, hasMine, adjacentMines, exploded, wrongFlag, isMineFlag } = cellData;

    // Визначаємо CSS класи
    let cellClass = styles.cell;
    let content = '';

    if (state === CellState.Open) {
        cellClass += ` ${styles.open}`;
        if (exploded) {
            cellClass += ` ${styles.exploded}`;
            content = '💥';
        } else if (hasMine) {
            cellClass += ` ${styles.mine}`;
            content = '💣';
        } else if (adjacentMines > 0) {
            cellClass += ` ${styles[`n${adjacentMines}`]}`;
            content = adjacentMines;
        }
    } else if (state === CellState.Flagged) {
        cellClass += ` ${styles.flag}`;
        content = '🚩';
        if (isMineFlag) {
            cellClass += ` ${styles['flag-mine']}`; // Змінено на ['flag-mine']
        }
    } else {
        cellClass += ` ${styles.closed}`;
    }

    // Обробники подій
    const handleClick = (e) => onCellClick(row, col);
    const handleRightClick = (e) => {
        e.preventDefault();
        onCellRightClick(row, col);
    };

    return (
        <div
            className={cellClass}
            onClick={handleClick}
            onContextMenu={handleRightClick}
            data-row={row}
            data-col={col}
            aria-label={`Cell at ${row}, ${col}`}
        >
            {content}
        </div>
    );
});

Cell.displayName = 'Cell';
export default Cell;