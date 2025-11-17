import styles from './Cell.module.css';
// Убедись, что путь к utils правильный
import { CELL_STATE } from '../../KovalovAndrii/utils';

export default function Cell({ cell, row, col, onLeftClick, onRightClick }) {
  const handleClick = () => {
    onLeftClick(row, col);
  };

  const handleRight = (event) => {
    event.preventDefault(); // Отменяем стандартное контекстное меню
    onRightClick(row, col);
  };

  // --- Определение стилей и контента ---
  let cellClass = styles.cell;
  let content = ''; // По умолчанию контента нет

  switch (cell.state) {
    case CELL_STATE.OPEN:
      cellClass += ' ' + styles.open;
      if (cell.hasMine) {
        cellClass += ' ' + styles.mine; // CSS добавит '💣'
      } else if (cell.neighborMines > 0) {
        content = cell.neighborMines; // Показываем цифру

        // 👇🔥 ВОТ ИЗМЕНЕНИЕ:
        // Добавляем класс .number1, .number2 и т.д.
        cellClass += ` ${styles['number' + cell.neighborMines]}`;
      }
      break;

    case CELL_STATE.FLAG:
      cellClass += ' ' + styles.flag; // CSS добавит '🚩'
      break;

    case CELL_STATE.INCORRECT_FLAG:
      cellClass += ' ' + styles.incorrectFlag; // CSS добавит '❌'
      break;

    case CELL_STATE.MINE_HIT:
      cellClass += ' ' + styles.mineHit; // CSS добавит '💥'
      break;

    case CELL_STATE.CLOSED:
    default:
      cellClass += ' ' + styles.closed;
      break;
  }

  return (
    <div
      className={cellClass}
      onClick={handleClick}
      onContextMenu={handleRight}
    >
      {content} {/* Показываем ТОЛЬКО цифры */}
    </div>
  );
}