import React from 'react';
import Cell from './Cell';
import styles from './Minesweeper.module.css';

function Board({ field, revealed, flags, onCellClick, onRightClick }) {
  return (
    <div
      className={styles.gameBoard}
      style={{
        gridTemplateColumns: `repeat(${field[0].length}, 35px)`,
        gridTemplateRows: `repeat(${field.length}, 35px)`
      }}
    >
      {field.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <Cell
            key={`${rIdx}-${cIdx}`}
            value={cell}
            revealed={revealed[rIdx][cIdx]}
            flagged={flags[rIdx][cIdx]}
            onClick={() => onCellClick(rIdx, cIdx)}
            onRightClick={(e) => onRightClick(rIdx, cIdx, e)}
          />
        ))
      )}
    </div>
  );
}

export default Board;
