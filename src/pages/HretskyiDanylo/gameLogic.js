// src/pages/HretskyiDanylo/gameLogic.js
export const CELL_STATE = { COVERED: 0, UNCOVERED: 1, FLAGGED: 2 };
export const GAME_STATE = { PLAYING: 0, WIN: 1, LOSE: -1 };

const dirs = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function inBounds(row, col, rows, cols) {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

function makeEmptyBoard(rows, cols) {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      row: r,
      col: c,
      mine: false,
      adj: 0,
      state: CELL_STATE.COVERED,
    }))
  );
}

function plantMines(board, rows, cols, mines) {
  const total = rows * cols;
  const positions = Array.from({ length: total }, (_, i) => i);
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  for (let k = 0; k < mines; k++) {
    const pos = positions[k];
    const r = Math.floor(pos / cols);
    const c = pos % cols;
    board[r][c].mine = true;
  }
}

function computeAdj(board, rows, cols) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (inBounds(nr, nc, rows, cols) && board[nr][nc].mine) count++;
      }
      board[r][c].adj = count;
    }
  }
}

export function createNewGame(rows, cols, mines) {
  const board = makeEmptyBoard(rows, cols);
  plantMines(board, rows, cols, mines);
  computeAdj(board, rows, cols);
  return {
    rows,
    cols,
    mines,
    board,
    status: GAME_STATE.PLAYING,
    explodedCell: null,
  };
}

export function countFlags(board) {
  let flags = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.state === CELL_STATE.FLAGGED) flags++;
    }
  }
  return flags;
}

function isWin(board) {
  for (const row of board) {
    for (const cell of row) {
      if (!cell.mine && cell.state !== CELL_STATE.UNCOVERED) return false;
    }
  }
  return true;
}

function cloneGame(game) {
  return {
    ...game,
    board: game.board.map((row) => row.map((cell) => ({ ...cell }))),
    explodedCell: game.explodedCell ? { ...game.explodedCell } : null,
  };
}

export function openCell(game, row, col) {
  if (game.status !== GAME_STATE.PLAYING) return game;
  if (!inBounds(row, col, game.rows, game.cols)) return game;

  const next = cloneGame(game);
  const start = next.board[row][col];

  if (start.state === CELL_STATE.UNCOVERED || start.state === CELL_STATE.FLAGGED)
    return next;

  if (start.mine) {
    start.state = CELL_STATE.UNCOVERED;
    next.status = GAME_STATE.LOSE;
    next.explodedCell = { row, col };
    return next;
  }

  const q = [[row, col]];
  while (q.length) {
    const [r, c] = q.shift();
    const cell = next.board[r][c];

    if (cell.state === CELL_STATE.UNCOVERED || cell.state === CELL_STATE.FLAGGED)
      continue;

    cell.state = CELL_STATE.UNCOVERED;

    if (cell.adj === 0) {
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (!inBounds(nr, nc, next.rows, next.cols)) continue;
        const neigh = next.board[nr][nc];
        if (!neigh.mine && neigh.state === CELL_STATE.COVERED) {
          q.push([nr, nc]);
        }
      }
    }
  }

  if (isWin(next.board)) next.status = GAME_STATE.WIN;
  return next;
}

export function toggleFlag(game, row, col) {
  if (game.status !== GAME_STATE.PLAYING) return game;
  if (!inBounds(row, col, game.rows, game.cols)) return game;

  const next = cloneGame(game);
  const cell = next.board[row][col];

  // по відкритій клітинці прапор не ставимо
  if (cell.state === CELL_STATE.UNCOVERED) return next;

  const wasFlagged = cell.state === CELL_STATE.FLAGGED;

  // якщо хочемо ПОСТАВИТИ новий прапор,
  // перевіряємо, чи не закінчились
  if (!wasFlagged) {
    const used = countFlags(next.board);
    if (used >= game.mines) {
      // всі прапори вже використані – нічого не робимо
      return next;
    }
  }

  // якщо прапор був — знімаємо, якщо не було — ставимо
  cell.state = wasFlagged ? CELL_STATE.COVERED : CELL_STATE.FLAGGED;

  return next;
}
