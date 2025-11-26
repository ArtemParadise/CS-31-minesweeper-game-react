import React from 'react';
import styles from './Board.module.css';
import Cell from '../Cell/index.jsx';

/**
 * Компонент, що відображає ігрову дошку.
 */
const Board = ({ board, rows, cols, handleCellClick, handleCellRightClick }) => {

    const boardStyle = {
        gridTemplateColumns: `repeat(${cols}, 56px)`,
        gridAutoRows: '56px',
    };

    return (
        <div className={styles.board} style={boardStyle}>
            {board.map((rowArr, r) =>
                rowArr.map((cellData, c) => (
                    <Cell
                        key={`${r}-${c}`}
                        cellData={cellData}
                        row={r}
                        col={c}
                        onCellClick={handleCellClick}
                        onCellRightClick={handleCellRightClick}
                    />
                ))
            )}
        </div>
    );
};

export default Board;