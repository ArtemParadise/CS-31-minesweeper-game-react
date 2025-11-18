import Cell from '../Cell';
import styles from './Board.module.css';

export default function Board({ field, onLeftClick, onRightClick }) {
  const colCount = field[0].length;

  return (
    <div
      className={styles.board}
      style={{
        // Динамически задаем кол-во колонок в grid
        gridTemplateColumns: `repeat(${colCount}, 32px)`,
      }}
    >
      {field.map((rowArray, rowIndex) =>
        rowArray.map((cellData, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cellData}
            row={rowIndex}
            col={colIndex}
            onLeftClick={onLeftClick}
            onRightClick={onRightClick}
          />
        ))
      )}
    </div>
  );
}