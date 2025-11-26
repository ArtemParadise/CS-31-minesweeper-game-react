import Cell from './Cell';
import styles from '../styles/Board.module.css';

function Board({
  board,
  onCellLeftClick,
  onCellRightClick,
  onCellDoubleClick,
}) {
  const rowsCount = board.length;
  const columnsCount = board[0]?.length ?? 0;

  const boardStyle = {
    gridTemplateColumns: `repeat(${columnsCount}, 24px)`,
  };

  return (
    <section className={styles.board} style={boardStyle}>
      {board.map((row) =>
        row.map((cell) => (
          <Cell
            key={`${cell.rowIndex}-${cell.columnIndex}`}
            cell={cell}
            onLeftClick={onCellLeftClick}
            onRightClick={onCellRightClick}
            onDoubleClick={onCellDoubleClick}
          />
        )),
      )}
    </section>
  );
}

export default Board;