// Константы для состояний ячеек и статуса игры
export const CELL_STATE = {
  OPEN: 'open',
  CLOSED: 'closed',
  FLAG: 'flag',
  INCORRECT_FLAG: 'incorrect_flag', // <-- ДОБАВЬ ЭТО
  MINE_HIT: 'mine_hit', // <-- И ЭТО
};

export const GAME_STATUS = {
  PLAYING: 'playing',
  WIN: 'win',
  LOSE: 'lose',
};

/**
 * Создает новый объект ячейки
 */
export function createCell(hasMine = false) {
  return {
    hasMine,
    neighborMines: 0,
    state: CELL_STATE.CLOSED,
  };
}

/**
 * Генерирует пустое поле (двумерный массив ячеек)
 */
export function generateField(rowCount, colCount) {
  const field = [];
  for (let row = 0; row < rowCount; row++) {
    field[row] = [];
    for (let col = 0; col < colCount; col++) {
      field[row][col] = createCell();
    }
  }
  return field;
}

/**
 * Считает мины вокруг указанной ячейки
 */
export function countNeighborMines(field, row, col) {
  let count = 0;
  const rowCount = field.length;
  const colCount = field[0].length;

  for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
    for (let colOffset = -1; colOffset <= 1; colOffset++) {
      // Пропускаем саму ячейку
      if (rowOffset === 0 && colOffset === 0) continue;

      const neighborRow = row + rowOffset;
      const neighborCol = col + colOffset;

      // Проверяем, что не вышли за границы поля
      if (
        neighborRow >= 0 &&
        neighborRow < rowCount &&
        neighborCol >= 0 &&
        neighborCol < colCount
      ) {
        if (field[neighborRow][neighborCol].hasMine) {
          count++;
        }
      }
    }
  }
  return count;
}

/**
 * Расставляет мины на поле, избегая "безопасной" зоны первого клика
 */
export function placeMines(field, mineCount, safeRow, safeCol) {
  const rowCount = field.length;
  const colCount = field[0].length;
  let placedMinesCount = 0;

  while (placedMinesCount < mineCount) {
    const row = Math.floor(Math.random() * rowCount);
    const col = Math.floor(Math.random() * colCount);

    // Не ставим мину в ячейку первого клика и вокруг нее (зона 3x3)
    const isSafeZone =
      Math.abs(row - safeRow) <= 1 && Math.abs(col - safeCol) <= 1;

    if (!field[row][col].hasMine && !isSafeZone) {
      field[row][col].hasMine = true;
      placedMinesCount++;
    }
  }

  // После расстановки мин, считаем соседей для всех ячеек
  for (let row = 0; row < rowCount; row++) {
    for (let col = 0; col < colCount; col++) {
      if (!field[row][col].hasMine) {
        field[row][col].neighborMines = countNeighborMines(field, row, col);
      }
    }
  }
}

/**
 * Рекурсивно открывает ячейку и ее соседей (если у нее 0 мин)
 */
export function openCell(field, row, col) {
  const cell = field[row][col];

  // Не открываем уже открытую ячейку или флаг
  if (cell.state !== CELL_STATE.CLOSED) return;

  cell.state = CELL_STATE.OPEN;

  // Если ячейка пустая (0 мин), рекурсивно открываем соседей
  if (cell.neighborMines === 0 && !cell.hasMine) {
    const rowCount = field.length;
    const colCount = field[0].length;

    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let colOffset = -1; colOffset <= 1; colOffset++) {
        if (rowOffset === 0 && colOffset === 0) continue;

        const neighborRow = row + rowOffset;
        const neighborCol = col + colOffset;

        if (
          neighborRow >= 0 &&
          neighborRow < rowCount &&
          neighborCol >= 0 &&
          neighborCol < colCount &&
          field[neighborRow][neighborCol].state === CELL_STATE.CLOSED
        ) {
          openCell(field, neighborRow, neighborCol);
        }
      }
    }
  }
}

export function checkWin(field) {
  for (const row of field) {
    for (const cell of row) {
      // Если найдена ячейка БЕЗ мины, которая НЕ открыта, игра не окончена
      if (!cell.hasMine && cell.state !== CELL_STATE.OPEN) {
        return false;
      }
    }
  }
  // Если все ячейки без мин открыты - это победа
  return true;
}

export function toggleFlag(field, row, col) {
  const cell = field[row][col];

  if (cell.state === CELL_STATE.OPEN) return;

  if (cell.state === CELL_STATE.CLOSED) {
    cell.state = CELL_STATE.FLAG;
  } else if (cell.state === CELL_STATE.FLAG) {
    cell.state = CELL_STATE.CLOSED;
  }
}