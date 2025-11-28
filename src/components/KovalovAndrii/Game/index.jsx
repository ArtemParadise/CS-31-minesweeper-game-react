import { useState } from 'react';
import Header from '../Header';
import Board from '../Board';
import {
  generateField,
  placeMines,
  openCell,
  toggleFlag,
  checkWin,
  CELL_STATE,
  GAME_STATUS,
} from '../utils'; // Импортируем нашу логику

// Настройки игры
const GAME_ROWS = 10;
const GAME_COLS = 10;
const GAME_MINES = 15;

export default function Game() {
  // --- Состояние Игры ---
  const [field, setField] = useState(generateField(GAME_ROWS, GAME_COLS));
  const [status, setStatus] = useState(GAME_STATUS.PLAYING);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const [flagsLeft, setFlagsLeft] = useState(GAME_MINES);
  const [time, setTime] = useState(0);

  // --- Функция Рестарта ---
  const restartGame = () => {
    setField(generateField(GAME_ROWS, GAME_COLS));
    setStatus(GAME_STATUS.PLAYING);
    setIsFirstClick(true);
    setFlagsLeft(GAME_MINES);
    setTime(0);
  };

  // --- Обработчики Кликов ---

  const handleLeftClick = (row, col) => {
    // Не даем кликать, если игра окончена
    if (status !== GAME_STATUS.PLAYING) return;

    // Глубокое копирование поля, чтобы React "увидел" изменения
    const updatedField = structuredClone(field);

    // Логика первого клика: расставляем мины
    if (isFirstClick) {
      placeMines(updatedField, GAME_MINES, row, col);
      setIsFirstClick(false);
    }

    // Открываем ячейку
    openCell(updatedField, row, col);

    // --- Проверки после клика ---
    const cell = updatedField[row][col];

    if (cell.hasMine) {
      // 1. Проигрыш: наступили на мину
      setStatus(GAME_STATUS.LOSE); // Сначала меняем статус

      // Перебираем поле и показываем все ошибки
      updatedField.forEach((rowArray) =>
        rowArray.forEach((cellInRow) => {
          // Если в ячейке мина, но нет флага - открываем (покажет 💣)
          if (cellInRow.hasMine && cellInRow.state !== CELL_STATE.FLAG) {
            cellInRow.state = CELL_STATE.OPEN;
          }
          // Если в ячейке НЕТ мины, но стоит флаг - помечаем как ошибку (покажет ❌)
          if (!cellInRow.hasMine && cellInRow.state === CELL_STATE.FLAG) {
            cellInRow.state = CELL_STATE.INCORRECT_FLAG;
          }
        })
      );

      // Ячейку, на которую кликнули, помечаем особо (покажет 💥)
      cell.state = CELL_STATE.MINE_HIT;
      
    } else if (checkWin(updatedField)) {
      // 2. Победа
      setStatus(GAME_STATUS.WIN);
    }

    // Обновляем поле в состоянии
    setField(updatedField);
  };

  const handleRightClick = (row, col) => {
    // Не даем кликать, если игра окончена
    if (status !== GAME_STATUS.PLAYING) return;

    const updatedField = structuredClone(field);
    const cell = updatedField[row][col];

    // Логика счетчика флагов
    if (cell.state === CELL_STATE.FLAG) {
      // Снимаем флаг
      setFlagsLeft(flagsLeft + 1);
    } else if (cell.state === CELL_STATE.CLOSED) {
      // Ставим флаг, если они остались
      if (flagsLeft === 0) return; // Флаги закончились
      setFlagsLeft(flagsLeft - 1);
    } else {
      // Нельзя поставить флаг на открытую ячейку
      return;
    }

    toggleFlag(updatedField, row, col);
    setField(updatedField);
  };

  // --- Рендер компонента ---
  return (
    // Обертка, чтобы игра не растягивалась на всю ширину
    <div style={{ display: 'inline-block' }}>
      <Header
        flagsLeft={flagsLeft}
        time={time}
        setTime={setTime}
        status={status}
        restart={restartGame}
      />

      <Board
        field={field}
        onLeftClick={handleLeftClick}
        onRightClick={handleRightClick}
      />

      {/* Сообщения о победе/проигрыше */}
      {status === GAME_STATUS.WIN && (
        <p style={{ textAlign: 'center', marginTop: 10, fontSize: 20 }}>
          🎉 You Win!
        </p>
      )}

      {status === GAME_STATUS.LOSE && (
        <p style={{ textAlign: 'center', marginTop: 10, fontSize: 20 }}>
          💥 You Lose!
        </p>
      )}
    </div>
  );
}