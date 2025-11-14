import React from 'react';
import styles from './Board.module.css';
import Cell from '../Cell';

const Board = ({ boardData, onCellClick, onCellContextMenu }) => {
  return (
    <div 
      className={styles.grid} 
      style={{ gridTemplateColumns: `repeat(${boardData[0]?.length || 10}, 1fr)` }}
    >
      {boardData.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            cellData={cell}
            onClick={() => onCellClick(r, c)}
            onContextMenu={(e) => {
              e.preventDefault();
              onCellContextMenu(r, c);
            }}
          />
        ))
      )}
    </div>
  );
};

export default Board;