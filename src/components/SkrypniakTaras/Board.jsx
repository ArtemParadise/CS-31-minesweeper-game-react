import React from 'react';
import Cell from './Cell';
import styles from './Game.module.css';

export default function Board({ rows, cols, grid, states, onLeftClick, onRightClick, done = false }) {
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = r * cols + c;
      cells.push(
        <Cell
          key={`${r}-${c}`}
          row={r}
          col={c}
          value={grid[r]?.[c]?.value ?? 0}
          mine={grid[r]?.[c]?.mine ?? false}
          revealed={states[k]?.revealed ?? false}
          flagged={states[k]?.flagged ?? false}
          onLeftClick={() => onLeftClick(r, c)}
          onRightClick={(e) => onRightClick(r, c, e)}
        />
      );
    }
  }

  return (
    <div
      className={`${styles.gameField} ${done ? styles.done : ''}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 16px)`,
        gridTemplateRows: `repeat(${rows}, 16px)`
      }}
    >
      {cells}
    </div>
  );
}
