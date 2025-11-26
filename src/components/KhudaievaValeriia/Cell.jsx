// src/components/KhudaievaValeriia/Cell.jsx

import React from 'react';
import styles from './Cell.module.css';

const CellState = { CLOSED: "closed", OPEN: "open", FLAGGED: "flagged" };

const Cell = React.memo(({ data, row, col, openCell, toggleFlag }) => {
    
    const handleLeftClick = () => {
        if (data.state === CellState.FLAGGED) return;
        openCell(row, col);
    };

    const handleRightClick = (e) => {
        e.preventDefault();
        toggleFlag(row, col);
    };

    let content = '';
    let cellClasses = [styles.cell];

    if (data.state === CellState.OPEN) {
        cellClasses.push(styles.open);
        if (data.hasMine) {
            content = '💣';
            cellClasses.push(styles.mine);
        } else if (data.neighborMines > 0) {
            content = data.neighborMines;
            cellClasses.push(styles[`n${data.neighborMines}`]); 
        }
    } else if (data.state === CellState.FLAGGED) {
        content = '🚩';
        cellClasses.push(styles.flag);
    } else {
        cellClasses.push(styles.closed);
    }
    
    return (
        <div 
            className={cellClasses.join(' ')}
            onClick={handleLeftClick}
            onContextMenu={handleRightClick}
        >
            {content}
        </div>
    );
});

export default Cell;