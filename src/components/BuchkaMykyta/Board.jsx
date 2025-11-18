import Cell from './Cell';
import styles from './Board.module.css';

export default function Board({ grid, onCellClick, onCellRightClick, onCellDoubleClick, cols }) {
  return (
    <section
      className={styles.board}
      style={{ gridTemplateColumns: `repeat(${cols}, 25px)` }}
    >
      {grid.map((row, rowIdx) =>
        row.map((cell, colIdx) => (
          <Cell
            key={`${rowIdx}-${colIdx}`}
            cell={cell}
            onClick={() => onCellClick(cell)}
            onRightClick={() => onCellRightClick(cell)}
            onDoubleClick={() => onCellDoubleClick(cell)}
          />
        ))
      )}
    </section>
  );
}
