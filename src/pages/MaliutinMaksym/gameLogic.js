// ==== КОНСТАНТИ ====
import { CELL_STATE } from '../../core/MaliutinMaksym/constants.js';

// ==== КЛАСИ (для структури даних) ====
class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.hasMine = false;
    this.neighborCount = 0;
    this.state = CELL_STATE.CLOSED; // Використовуємо імпортовану константу
    this.id = `${row}-${col}`; // Унікальний ключ для React
  }
}

// ==== ЛОГІКА ГЕНЕРАЦІЇ ПОЛЯ ====

// Створює порожню дошку
function createBoard(rows, cols) {
  const board = [];
  for (let row = 0; row < rows; row++) {
    const rowArray = [];
    for (let col = 0; col < cols; col++) {
      rowArray.push(new Cell(row, col));
    }
    board.push(rowArray);
  }
  return board;
}

// Розміщує міни
function placeMines(board, rows, cols, mineCount) {
  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!board[row][col].hasMine) {
      board[row][col].hasMine = true;
      minesPlaced++;
    }
  }
}

// Обчислює сусідів
function computeNeighborCounts(board, rows, cols) {
  function countNeighbors(row, col) {
    let count = 0;
    for (let dRow = -1; dRow <= 1; dRow++) {
      for (let dCol = -1; dCol <= 1; dCol++) {
        if (dRow === 0 && dCol === 0) continue;
        const nRow = row + dRow;
        const nCol = col + dCol;
        if (nRow >= 0 && nRow < rows && nCol >= 0 && nCol < cols) {
          if (board[nRow][nCol].hasMine) count++;
        }
      }
    }
    return count;
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      board[row][col].neighborCount = countNeighbors(row, col);
    }
  }
}

// Головна функція для створення повного стану дошки
export function generateField(rows, cols, mineCount) {
  const board = createBoard(rows, cols);

  placeMines(board, rows, cols, mineCount);
  computeNeighborCounts(board, rows, cols);

  return board;
}

// ==== ЛОГІКА ВІДКРИТТЯ КЛІТИНОК (Flood Fill) ====

// Ця функція МУТУЄ newBoard, що є нормальним, оскільки це копія стану
function revealRecursive(newBoard, rows, cols, row, col) {
  const cell = newBoard[row][col];

  // Зупиняємо рекурсію, якщо клітинка вже відкрита або має прапор
  if (cell.state !== CELL_STATE.CLOSED) return;

  cell.state = CELL_STATE.OPEN;

  // Якщо клітинка "порожня" (0 сусідів), рекурсивно відкриваємо сусідів
  if (cell.neighborCount === 0) {
    for (let dRow = -1; dRow <= 1; dRow++) {
      for (let dCol = -1; dCol <= 1; dCol++) {
        if (dRow === 0 && dCol === 0) continue;
        const nRow = row + dRow;
        const nCol = col + dCol;
        if (nRow >= 0 && nRow < rows && nCol >= 0 && nCol < cols) {
          if (newBoard[nRow][nCol].state === CELL_STATE.CLOSED) {
            revealRecursive(newBoard, rows, cols, nRow, nCol);
          }
        }
      }
    }
  }
}

// Головна функція, яку викликає компонент React
export function revealCell(board, rows, cols, row, col) {
  const cell = board[row][col];

  // Не можна відкрити вже відкриту або помічену клітинку
  if (cell.state === CELL_STATE.OPEN || cell.state === CELL_STATE.FLAGGED) {
    return { newBoard: board, gameOver: false };
  }

  // Якщо це міна - кінець гри
  if (cell.hasMine) {
    return { newBoard: revealAllMines(board, rows, cols), gameOver: true };
  }

  // Створюємо глибоку копію дошки для React
  const newBoard = board.map((r) => r.map((c) => ({ ...c })));

  // Запускаємо рекурсивне відкриття
  revealRecursive(newBoard, rows, cols, row, col);

  return { newBoard, gameOver: false };
}

// Допоміжна функція для показу всіх мін при програші
function revealAllMines(board, rows, cols) {
  const newBoard = board.map((r) => r.map((c) => ({ ...c })));
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = newBoard[row][col];
      if (cell.hasMine) {
        cell.state = CELL_STATE.OPEN;
      }
    }
  }
  return newBoard;
}

// ==== ЛОГІКА ПРАПОРІВ ====
export function toggleFlagOnCell(board, row, col, currentFlags) {
  const newBoard = board.map((r) => r.map((c) => ({ ...c })));
  const cell = newBoard[row][col];
  let flagsAdded = 0;

  if (cell.state === CELL_STATE.CLOSED) {
    cell.state = CELL_STATE.FLAGGED;
    flagsAdded = 1;
  } else if (cell.state === CELL_STATE.FLAGGED) {
    cell.state = CELL_STATE.CLOSED;
    flagsAdded = -1;
  }

  return { newBoard, newFlags: currentFlags + flagsAdded };
}

// ==== ПЕРЕВІРКА УМОВ ПЕРЕМОГИ ====
export function checkWinCondition(board, rows, cols, mineCount) {
  let closedOrFlagged = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = board[row][col];
      if (cell.state !== CELL_STATE.OPEN) {
        closedOrFlagged++;
      }
    }
  }
  // Перемога, якщо кількість закритих клітинок дорівнює кількості мін
  return closedOrFlagged === mineCount;
}