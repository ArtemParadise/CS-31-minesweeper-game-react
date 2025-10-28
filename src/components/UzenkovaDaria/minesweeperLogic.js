export const CellState = {
  CLOSED: "closed",
  OPEN: "open",
  FLAGGED: "flagged",
};

export const GameStatus = {
  IN_PROGRESS: "in-progress",
  READY: "ready", 
  WIN: "win",
  LOSE: "lose",
};

function createCell(hasMine = false) {
  return {
    hasMine: Boolean(hasMine),
    adjacentMines: 0,
    state: CellState.CLOSED,
    exploded: false,
  };
}

function createEmptyBoard(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => createCell())
  );
}

function placeMines(board, rows, cols, minesCount, firstClick) {
  const forbiddenPositions = new Set();
  if (firstClick) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        forbiddenPositions.add(`${firstClick.r + dr},${firstClick.c + dc}`);
      }
    }
  }

  const positions = [];
  while (positions.length < minesCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    const posKey = `${r},${c}`;

    if (!forbiddenPositions.has(posKey) && !positions.some(p => p.r === r && p.c === c)) {
      positions.push({ r, c });
    }
  }

  for (const { r, c } of positions) {
    if (board[r] && board[r][c]) board[r][c].hasMine = true;
  }
}

function computeAdjacentCounts(board) {
  const rows = board.length;
  const cols = board[0].length;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].hasMine) {
        board[r][c].adjacentMines = -1;
        continue;
      }
      let cnt = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (board[nr][nc].hasMine) cnt++;
          }
        }
      }
      board[r][c].adjacentMines = cnt;
    }
  }
}

export function createGame(rows, cols, minesCount) {
  const board = createEmptyBoard(rows, cols);
  return {
    rows,
    cols,
    mines: minesCount,
    flagsLeft: minesCount,
    status: GameStatus.READY,
    board,
    firstClick: true,
  };
}

export function initializeGame(game, clickedRow, clickedCol) {
  const newBoard = game.board.map(row => row.map(cell => ({...cell})));
  placeMines(newBoard, game.rows, game.cols, game.mines, { r: clickedRow, c: clickedCol });
  computeAdjacentCounts(newBoard);

  const newGame = {
    ...game,
    board: newBoard,
    status: GameStatus.IN_PROGRESS,
    firstClick: false,
  };
  
  return openCell(newGame, clickedRow, clickedCol);
}

function revealAllMines(board, clickedMineCoords = null) {
  return board.map((row, r) => row.map((cell, c) => {
    if (!cell.hasMine) return cell;
    const isExploded = clickedMineCoords && clickedMineCoords.r === r && clickedMineCoords.c === c;
    return { ...cell, state: CellState.OPEN, exploded: isExploded };
  }));
}

export function openCell(game, row, col) {
  const newBoard = game.board.map(r => r.map(c => ({...c})));

  if (row < 0 || row >= game.rows || col < 0 || col >= game.cols) return { game, board: newBoard };
  
  const cell = newBoard[row][col];
  if (cell.state !== CellState.CLOSED) return { game, board: newBoard };

  cell.state = CellState.OPEN;

  if (cell.hasMine) {
    cell.exploded = true;
    return {
      game: { ...game, status: GameStatus.LOSE },
      board: revealAllMines(newBoard, { r: row, c: col }),
    };
  }

  let boardAfterFloodFill = newBoard;
  if (cell.adjacentMines === 0) {
    const queue = [{ r: row, c: col }];
    while (queue.length > 0) {
      const { r: cr, c: cc } = queue.shift();
      
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = cr + dr, nc = cc + dc;

          if (nr >= 0 && nr < game.rows && nc >= 0 && nc < game.cols) {
            const adjacentCell = boardAfterFloodFill[nr][nc];
            if (adjacentCell.state === CellState.CLOSED) {
              adjacentCell.state = CellState.OPEN;
              if (adjacentCell.adjacentMines === 0) {
                queue.push({ r: nr, c: nc });
              }
            }
          }
        }
      }
    }
  }
  
  const unopenedSafe = boardAfterFloodFill
    .flat()
    .filter(c => !c.hasMine && c.state !== CellState.OPEN).length;
  
  if (unopenedSafe === 0) {
    return {
      game: { ...game, status: GameStatus.WIN },
      board: revealAllMines(boardAfterFloodFill),
    };
  }

  return { game, board: boardAfterFloodFill };
}

export function toggleFlag(game, row, col) {
  const newBoard = game.board.map(r => r.map(c => ({...c})));
  const cell = newBoard[row][col];

  if (cell.state === CellState.OPEN) return { game, board: newBoard };

  let newFlagsLeft = game.flagsLeft;

  if (cell.state === CellState.FLAGGED) {
    cell.state = CellState.CLOSED;
    newFlagsLeft++;
  } else {
    if (game.flagsLeft <= 0) return { game, board: newBoard };
    cell.state = CellState.FLAGGED;
    newFlagsLeft--;
  }

  return {
    game: { ...game, flagsLeft: newFlagsLeft },
    board: newBoard,
  };
}

export function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}