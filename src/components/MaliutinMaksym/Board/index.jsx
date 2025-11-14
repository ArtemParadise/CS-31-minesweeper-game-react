import React from 'react';
import Cell from '../Cell'; // Імпортуємо наш компонент Cell
import styles from './Board.module.css';

const Board = ({ board, onCellClick, onCellContextMenu }) => {
  return (
    <div className={styles.gameBoard}>
      {board.map((row, rowIndex) => (
        <div className={styles.boardRow} key={rowIndex}>
          {row.map((cell, colIndex) => (
            <Cell
              key={cell.id}
              cellData={cell}
              onClick={() => onCellClick(rowIndex, colIndex)}
              onContextMenu={(e) => onCellContextMenu(e, rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;