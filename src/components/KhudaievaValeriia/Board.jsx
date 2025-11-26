// src/components/KhudaievaValeriia/Board.jsx

import React from 'react';
import Cell from './Cell'; 
import styles from './Board.module.css';

function Board({ board, openCell, toggleFlag, cols }) {
    
    const boardStyle = {
        gridTemplateColumns: `repeat(${cols}, 35px)`,
    };

    return (
        <div className={styles.board} style={boardStyle}>
            {board.map((rowArr, r) => ( 
                rowArr.map((cellData, c) => (
                    <Cell 
                        key={`${r}-${c}`}
                        data={cellData}
                        row={r}
                        col={c}
                        openCell={openCell}
                        toggleFlag={toggleFlag}
                    />
                )) 
            ))} 
        </div>
    );
}

export default Board;