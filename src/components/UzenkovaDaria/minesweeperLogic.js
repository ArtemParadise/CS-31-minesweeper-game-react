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
    for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {
      for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
        forbiddenPositions.add(
          `${firstClick.row + deltaRow},${firstClick.col + deltaCol}`
        );
      }
    }
  }

  const positions = [];
  while (positions.length < minesCount) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);
    const posKey = `${randomRow},${randomCol}`;

    if (
      !forbiddenPositions.has(posKey) &&
      !positions.some(
        (pos) => pos.row === randomRow && pos.col === randomCol
      )
    ) {
      positions.push({ row: randomRow, col: randomCol });
    }
  }

  for (const { row, col } of positions) {
    if (board[row] && board[row][col]) board[row][col].hasMine = true;
  }
}

function computeAdjacentCounts(board) {
  const rows = board.length;
  const cols = board[0].length;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col].hasMine) {
        board[row][col].adjacentMines = -1;
        continue;
      }
      let count = 0;
      for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {
        for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
          if (deltaRow === 0 && deltaCol === 0) continue;
          const newRow = row + deltaRow,
            newCol = col + deltaCol;
          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            if (board[newRow][newCol].hasMine) count++;
          }
        }
      }
      board[row][col].adjacentMines = count;
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
  const newBoard = game.board.map((row) => row.map((cell) => ({ ...cell })));
  placeMines(newBoard, game.rows, game.cols, game.mines, {
    row: clickedRow,
    col: clickedCol,
  });
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
  return board.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      if (!cell.hasMine) return cell;
      const isExploded =
        clickedMineCoords &&
        clickedMineCoords.row === rowIndex &&
        clickedMineCoords.col === colIndex;
      return { ...cell, state: CellState.OPEN, exploded: isExploded };
    })
  );
}

export function openCell(game, row, col) {
  const newBoard = game.board.map((rowArray) =>
    rowArray.map((cell) => ({ ...cell }))
  );

  if (row < 0 || row >= game.rows || col < 0 || col >= game.cols)
    return { game, board: newBoard };

  const cell = newBoard[row][col];
  if (cell.state !== CellState.CLOSED) return { game, board: newBoard };

  cell.state = CellState.OPEN;

  if (cell.hasMine) {
    cell.exploded = true;
    return {
      game: { ...game, status: GameStatus.LOSE },
      board: revealAllMines(newBoard, { row: row, col: col }),
    };
  }

  let boardAfterFloodFill = newBoard;
  if (cell.adjacentMines === 0) {
    const queue = [{ row: row, col: col }];
    while (queue.length > 0) {
      const { row: currentRow, col: currentCol } = queue.shift();

      for (let deltaRow = -1; deltaRow <= 1; deltaRow++) {
        for (let deltaCol = -1; deltaCol <= 1; deltaCol++) {
          if (deltaRow === 0 && deltaCol === 0) continue;
          const newRow = currentRow + deltaRow,
            newCol = currentCol + deltaCol;

          if (
            newRow >= 0 &&
            newRow < game.rows &&
            newCol >= 0 &&
            newCol < game.cols
          ) {
            const adjacentCell = boardAfterFloodFill[newRow][newCol];
            if (adjacentCell.state === CellState.CLOSED) {
              adjacentCell.state = CellState.OPEN;
              if (adjacentCell.adjacentMines === 0) {
                queue.push({ row: newRow, col: newCol });
              }
            }
          }
        }
      }
    }
  }

  const unopenedSafe = boardAfterFloodFill
    .flat()
    .filter((cell) => !cell.hasMine && cell.state !== CellState.OPEN).length;

  if (unopenedSafe === 0) {
    return {
      game: { ...game, status: GameStatus.WIN },
      board: revealAllMines(boardAfterFloodFill),
    };
  }

  return { game, board: boardAfterFloodFill };
}

export function toggleFlag(game, row, col) {
  const newBoard = game.board.map((rowArray) =>
    rowArray.map((cell) => ({ ...cell }))
  );
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

export function formatTime(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}