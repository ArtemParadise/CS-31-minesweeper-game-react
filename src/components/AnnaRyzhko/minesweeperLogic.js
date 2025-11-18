// --- КОНФІГУРАЦІЯ ГРИ ---
const ROWS = 10;
const COLS = 11;
const MINES = 15;
// -----------------------

// Стани клітинки та гри
export const CellState = Object.freeze({ Closed: 'closed', Open: 'open', Flagged: 'flagged' });
export const GameStatus = Object.freeze({ InProgress: 'in_progress', Win: 'win', Lose: 'lose' });

/** Створює початковий об'єкт стану гри */
export function createInitialGameState() {
    return {
        rows: ROWS,
        cols: COLS,
        mineCount: MINES,
        status: GameStatus.InProgress,
        board: [],
        secondsElapsed: 0,
        flagsRemaining: MINES,
    };
}

/** Створює порожню клітинку */
function createCell() {
    return { hasMine: false, adjacentMines: 0, state: CellState.Closed, exploded: false, wrongFlag: false };
}

/** Перевіряє, чи знаходиться клітинка в межах дошки */
function inBounds(rows, cols, row, col) {
    return row >= 0 && row < rows && col >= 0 && col < cols;
}

/** Повертає координати всіх сусідів клітинки */
function neighbors(rows, cols, row, col) {
    const result = [];
    for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {
        for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
            if (deltaRow === 0 && deltaCol === 0) continue;
            const neighborRow = row + deltaRow;
            const neighborCol = col + deltaCol;
            if (inBounds(rows, cols, neighborRow, neighborCol)) {
                result.push([neighborRow, neighborCol]);
            }
        }
    }
    return result;
}

/** Підраховує кількість мін у сусідніх клітинках */
function countNeighbourMines(board, rows, cols, row, col) {
    let mineCount = 0;
    for (const [nRow, nCol] of neighbors(rows, cols, row, col)) {
        if (board[nRow][nCol].hasMine) {
            mineCount++;
        }
    }
    return mineCount;
}

/** Генерує ігрове поле з мінами та лічильниками */
export function generateField({ rows, cols, mineCount }) {
    const board = Array.from({ length: rows }, () => Array.from({ length: cols }, createCell));
    const totalCells = rows * cols;
    const minePositions = new Set();

    while (minePositions.size < mineCount) {
        const randomPos = Math.floor(Math.random() * totalCells);
        minePositions.add(randomPos);
    }

    // Розташування мін
    let currentMineIndex = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (minePositions.has(currentMineIndex)) {
                board[row][col].hasMine = true;
            }
            currentMineIndex++;
        }
    }

    // Підрахунок сусідніх мін для всіх клітинок
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (!board[row][col].hasMine) {
                board[row][col].adjacentMines = countNeighbourMines(board, rows, cols, row, col);
            }
        }
    }
    return board;
}

/** Рекурсивна функція для відкриття клітинок */
function recursiveOpen(board, rows, cols, r, c) {
    const cell = board[r][c];
    if (cell.state !== CellState.Closed || cell.hasMine) return;

    cell.state = CellState.Open;

    if (cell.adjacentMines === 0) {
        for (const [nRow, nCol] of neighbors(rows, cols, r, c)) {
            recursiveOpen(board, rows, cols, nRow, nCol);
        }
    }
}

/** Перевірка на перемогу: всі клітинки без мін відкриті */
export function checkWin(board) {
    const MINES = 15;
    const totalSafeCells = board.length * board[0].length - MINES;

    // Перевіряємо, чи кількість відкритих клітинок дорівнює кількості безпечних клітинок.
    // Якщо так, то всі міни залишилися закритими (Win).
    const openedCells = board.flat().filter(cell => cell.state === CellState.Open).length;

    return openedCells === totalSafeCells;
}

/** Відкриває всі міни при програші */
function revealAllMines(board, explodedRow, explodedCol) {
    board.forEach((rowArr, r) => {
        rowArr.forEach((cell, c) => {
            // Відкриваємо всі міни, які не були помічені прапорцем
            if (cell.hasMine && cell.state !== CellState.Flagged) {
                cell.state = CellState.Open;
            }
            else if (cell.hasMine && cell.state === CellState.Flagged) {
                cell.isMineFlag = true;
            }

            // Позначаємо міну, що вибухнула
            if (r === explodedRow && c === explodedCol) {
                cell.exploded = true;
            }
        });
    });
}

/** Основна логіка відкриття клітинки. Повертає новий стан дошки та статус гри. */
export function openCellLogic(currentBoard, rows, cols, row, col) {
    // Створюємо глибоку копію дошки (Імутабельність)
    const newBoard = currentBoard.map(rowArr => rowArr.map(c => ({ ...c })));

    const cell = newBoard[row][col];

    // Якщо клітинка вже відкрита або з прапорцем, нічого не робимо
    if (cell.state === CellState.Open || cell.state === CellState.Flagged) {

        // Якщо гра вже виграна, повертаємо Win, інакше InProgress
        const currentStatus = checkWin(currentBoard) ? GameStatus.Win : GameStatus.InProgress;
        return { newBoard: currentBoard, status: currentStatus };
    }

    // ЛОГІКА ПРОГРАШУ
    if (cell.hasMine) {
        revealAllMines(newBoard, row, col);
        return { newBoard, status: GameStatus.Lose };
    }

    // ЛОГІКА ВІДКРИТТЯ
    recursiveOpen(newBoard, rows, cols, row, col);

    // ПЕРЕВІРКА ПЕРЕМОГИ
    const newStatus = checkWin(newBoard) ? GameStatus.Win : GameStatus.InProgress;

    return { newBoard, status: newStatus };
}

/** Форматує секунди у формат MM:SS. */
export function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}