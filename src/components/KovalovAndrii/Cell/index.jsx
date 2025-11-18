import styles from './Cell.module.css';
import { CELL_STATE } from '../utils';

export default function Cell({ cell, row, col, onLeftClick, onRightClick }) {
  const handleClick = () => {
    onLeftClick(row, col);
  };

  const handleRight = (event) => {
    event.preventDefault(); 
    onRightClick(row, col);
  };

  const getCellClasses = () => {
    // Всегда есть базовый класс
    const classes = [styles.cell];

    switch (cell.state) {
      case CELL_STATE.OPEN:
        classes.push(styles.open); // Добавляем 'open'
        if (cell.hasMine) {
          classes.push(styles.mine); // Добавляем 'mine'
        } else if (cell.neighborMines > 0) {
          // Добавляем класс для цифры (number1, number2...)
          classes.push(styles['number' + cell.neighborMines]);
        }
        break;

      case CELL_STATE.FLAG:
        classes.push(styles.flag);
        break;

      case CELL_STATE.INCORRECT_FLAG:
        classes.push(styles.incorrectFlag);
        break;

      case CELL_STATE.MINE_HIT:
        classes.push(styles.mineHit);
        break;

      case CELL_STATE.CLOSED:
      default:
        classes.push(styles.closed);
        break;
    }

    // Собираем все классы из массива в одну строку
    return classes.join(' ');
  };

  // --- Определение содержимого ячейки ---
  let content = '';
  if (
    cell.state === CELL_STATE.OPEN &&
    !cell.hasMine &&
    cell.neighborMines > 0
  ) {
    content = cell.neighborMines; // Показываем ТОЛЬКО цифры
  }

  return (
    <div
      className={getCellClasses()} // Вызываем нашу новую функцию
      onClick={handleClick}
      onContextMenu={handleRight}
    >
      {content}
    </div>
  );
}