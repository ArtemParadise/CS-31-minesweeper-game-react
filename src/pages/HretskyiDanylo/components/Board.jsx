// src/pages/HretskyiDanylo/components/Board.jsx
import Cell from "./Cell";
import styles from "../styles/Board.module.css";

export default function Board({
  board,
  status,
  explodedCell,
  onOpen,
  onToggleFlag,
}) {
  return (
    <div className={styles.board}>
      {board.map((row, rIdx) => (
        <div key={rIdx} className={styles.row}>
          {row.map((cell) => (
            <Cell
              key={`${cell.row}-${cell.col}`}
              cell={cell}
              status={status}
              exploded={
                explodedCell &&
                explodedCell.row === cell.row &&
                explodedCell.col === cell.col
              }
              onOpen={() => onOpen(cell.row, cell.col)}
              onToggleFlag={(e) => {
                e.preventDefault();
                onToggleFlag(cell.row, cell.col);
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
