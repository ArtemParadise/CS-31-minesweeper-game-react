import { useEffect, useState } from 'react';
import Board from './components/Board';
import GameStatus from './components/GameStatus';
import styles from './styles/GameStatus.module.css'; // тут і загальний layout, і footer

// ---- Тип клітинки ----
function createEmptyCell(rowIndex, columnIndex) {
  return {
    rowIndex,
    columnIndex,
    hasMine: false,
    adjacentMinesCount: 0,
    isRevealed: false,
    isFlagged: false,
  };
}

// ---- Створення порожнього поля ----
function createEmptyBoard(rowsCount, columnsCount) {
  const board = [];

  for (let rowIndex = 0; rowIndex < rowsCount; rowIndex += 1) {
    const row = [];

    for (let columnIndex = 0; columnIndex < columnsCount; columnIndex += 1) {
      row.push(createEmptyCell(rowIndex, columnIndex));
    }

    board.push(row);
  }

  return board;
}

// ---- Допоміжний обхід сусідів ----
function forEachNeighbor(board, rowIndex, columnIndex, callback) {
  const rowsCount = board.length;
  const columnsCount = board[0]?.length ?? 0;

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
      const neighborRowIndex = rowIndex + rowOffset;
      const neighborColumnIndex = columnIndex + columnOffset;

      const isSameCell =
        neighborRowIndex === rowIndex && neighborColumnIndex === columnIndex;

      if (isSameCell) {
        continue;
      }

      const isInsideBoard =
        neighborRowIndex >= 0 &&
        neighborRowIndex < rowsCount &&
        neighborColumnIndex >= 0 &&
        neighborColumnIndex < columnsCount;

      if (!isInsideBoard) {
        continue;
      }

      callback(board[neighborRowIndex][neighborColumnIndex]);
    }
  }
}

// ---- Розміщення мін + підрахунок сусідів ----
function placeMines(board, minesCount, safeRowIndex, safeColumnIndex) {
  const rowsCount = board.length;
  const columnsCount = board[0]?.length ?? 0;

  let placedMinesCount = 0;

  while (placedMinesCount < minesCount) {
    const randomRowIndex = Math.floor(Math.random() * rowsCount);
    const randomColumnIndex = Math.floor(Math.random() * columnsCount);

    const cell = board[randomRowIndex][randomColumnIndex];

    const isSafeArea =
      Math.abs(randomRowIndex - safeRowIndex) <= 1 &&
      Math.abs(randomColumnIndex - safeColumnIndex) <= 1;

    if (cell.hasMine || isSafeArea) {
      continue;
    }

    cell.hasMine = true;
    placedMinesCount += 1;
  }

  for (let rowIndex = 0; rowIndex < rowsCount; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < columnsCount; columnIndex += 1) {
      const cell = board[rowIndex][columnIndex];

      let adjacentMinesCount = 0;

      forEachNeighbor(board, rowIndex, columnIndex, (neighborCell) => {
        if (neighborCell.hasMine) {
          adjacentMinesCount += 1;
        }
      });

      cell.adjacentMinesCount = adjacentMinesCount;
    }
  }
}

// ---- Розкриття клітин (flood fill) ----
function revealCells(board, startRowIndex, startColumnIndex) {
  const stack = [];
  stack.push(board[startRowIndex][startColumnIndex]);

  while (stack.length > 0) {
    const currentCell = stack.pop();

    if (currentCell.isRevealed || currentCell.isFlagged) {
      continue;
    }

    currentCell.isRevealed = true;

    const isEmptyCell =
      !currentCell.hasMine && currentCell.adjacentMinesCount === 0;

    if (!isEmptyCell) {
      continue;
    }

    forEachNeighbor(
      board,
      currentCell.rowIndex,
      currentCell.columnIndex,
      (neighborCell) => {
        if (!neighborCell.isRevealed && !neighborCell.isFlagged) {
          stack.push(neighborCell);
        }
      },
    );
  }
}

// ---- Підрахунок відкритих клітин ----
function countRevealedCells(board) {
  let revealedCellsCount = 0;

  board.forEach((row) => {
    row.forEach((cell) => {
      if (cell.isRevealed) {
        revealedCellsCount += 1;
      }
    });
  });

  return revealedCellsCount;
}

// ---- Головний компонент гри ----
function Minesweeper() {
  const [rowsCount, setRowsCount] = useState(10);
  const [columnsCount, setColumnsCount] = useState(10);
  const [minesCount, setMinesCount] = useState(15);

  const [board, setBoard] = useState(() =>
    createEmptyBoard(10, 10),
  );

  const [isFirstClick, setIsFirstClick] = useState(true);
  const [gameStatus, setGameStatus] = useState('idle'); // idle | running | won | lost
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [flagsCount, setFlagsCount] = useState(0);

  const remainingMinesCount = Math.max(minesCount - flagsCount, 0);

  // ---- Таймер ----
  useEffect(() => {
    if (gameStatus !== 'running') {
      return undefined;
    }

    const timerId = setInterval(() => {
      setElapsedSeconds((previousValue) =>
        Math.min(previousValue + 1, 999),
      );
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [gameStatus]);

  // ---- Старт нової гри ----
  const startNewGame = () => {
    const maximumMinesCount = rowsCount * columnsCount - 1;
    const safeMinesCount = Math.max(
      1,
      Math.min(minesCount, maximumMinesCount),
    );

    setMinesCount(safeMinesCount);
    setBoard(createEmptyBoard(rowsCount, columnsCount));
    setIsFirstClick(true);
    setGameStatus('idle');
    setElapsedSeconds(0);
    setFlagsCount(0);
  };

  // ---- Обробка лівого кліку ----
  const handleCellLeftClick = (rowIndex, columnIndex) => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      return;
    }

    const updatedBoard = board.map((row) =>
      row.map((cell) => ({ ...cell })),
    );

    const clickedCell = updatedBoard[rowIndex][columnIndex];

    if (clickedCell.isFlagged || clickedCell.isRevealed) {
      return;
    }

    if (isFirstClick) {
      placeMines(updatedBoard, minesCount, rowIndex, columnIndex);
      setIsFirstClick(false);
      setGameStatus('running');
      setElapsedSeconds(0);
    }

    if (clickedCell.hasMine) {
      updatedBoard.forEach((row) => {
        row.forEach((cell) => {
          if (cell.hasMine) {
            cell.isRevealed = true;
          }
        });
      });

      setBoard(updatedBoard);
      setGameStatus('lost');
      return;
    }

    revealCells(updatedBoard, rowIndex, columnIndex);

    const totalCellsCount = rowsCount * columnsCount;
    const revealedCellsCount = countRevealedCells(updatedBoard);

    if (revealedCellsCount === totalCellsCount - minesCount) {
      setBoard(updatedBoard);
      setGameStatus('won');
      return;
    }

    setBoard(updatedBoard);
  };

  // ---- Обробка правого кліку (прапорець) ----
  const handleCellRightClick = (rowIndex, columnIndex) => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      return;
    }

    const updatedBoard = board.map((row) =>
      row.map((cell) => ({ ...cell })),
    );

    const cell = updatedBoard[rowIndex][columnIndex];

    if (cell.isRevealed) {
      return;
    }

    const willBeFlagged = !cell.isFlagged;
    cell.isFlagged = willBeFlagged;

    setBoard(updatedBoard);
    setFlagsCount((previousFlagsCount) =>
      previousFlagsCount + (willBeFlagged ? 1 : -1),
    );
  };

  // ---- Подвійний клік (chord) ----
  const handleCellDoubleClick = (rowIndex, columnIndex) => {
    const updatedBoard = board.map((row) =>
      row.map((cell) => ({ ...cell })),
    );

    const cell = updatedBoard[rowIndex][columnIndex];

    if (!cell.isRevealed || cell.adjacentMinesCount === 0) {
      return;
    }

    let flaggedNeighborsCount = 0;
    const coveredNeighbors = [];

    forEachNeighbor(updatedBoard, rowIndex, columnIndex, (neighborCell) => {
      if (neighborCell.isFlagged) {
        flaggedNeighborsCount += 1;
      } else if (!neighborCell.isRevealed) {
        coveredNeighbors.push(neighborCell);
      }
    });

    if (flaggedNeighborsCount !== cell.adjacentMinesCount) {
      return;
    }

    let openedMine = false;

    coveredNeighbors.forEach((neighborCell) => {
      if (neighborCell.hasMine) {
        openedMine = true;
        return;
      }

      revealCells(
        updatedBoard,
        neighborCell.rowIndex,
        neighborCell.columnIndex,
      );
    });

    if (openedMine) {
      updatedBoard.forEach((row) => {
        row.forEach((singleCell) => {
          if (singleCell.hasMine) {
            singleCell.isRevealed = true;
          }
        });
      });

      setBoard(updatedBoard);
      setGameStatus('lost');
      return;
    }

    const totalCellsCount = rowsCount * columnsCount;
    const revealedCellsCount = countRevealedCells(updatedBoard);

    if (revealedCellsCount === totalCellsCount - minesCount) {
      setBoard(updatedBoard);
      setGameStatus('won');
      return;
    }

    setBoard(updatedBoard);
  };

  // ---- Обробка змін інпутів ----
  const handleRowsChange = (event) => {
    const value = Number.parseInt(event.target.value, 10);
    setRowsCount(Number.isNaN(value) ? 0 : value);
  };

  const handleColumnsChange = (event) => {
    const value = Number.parseInt(event.target.value, 10);
    setColumnsCount(Number.isNaN(value) ? 0 : value);
  };

  const handleMinesChange = (event) => {
    const value = Number.parseInt(event.target.value, 10);
    setMinesCount(Number.isNaN(value) ? 0 : value);
  };

  return (
    <div className={styles.gamePageWrapper}>
      <div className={styles.gameContainer}>
        <GameStatus
          remainingMinesCount={remainingMinesCount}
          elapsedSeconds={elapsedSeconds}
          gameStatus={gameStatus}
          onRestart={startNewGame}
        />

        <Board
          board={board}
          onCellLeftClick={handleCellLeftClick}
          onCellRightClick={handleCellRightClick}
          onCellDoubleClick={handleCellDoubleClick}
        />

        <footer className={styles.footer}>
          <div className={styles.controlsRow}>
            <label className={styles.inputLabel}>
              Rows:
              <input
                type="number"
                min={5}
                max={40}
                value={rowsCount}
                onChange={handleRowsChange}
                className={styles.numberInput}
              />
            </label>

            <label className={styles.inputLabel}>
              Cols:
              <input
                type="number"
                min={5}
                max={60}
                value={columnsCount}
                onChange={handleColumnsChange}
                className={styles.numberInput}
              />
            </label>

            <label className={styles.inputLabel}>
              Mines:
              <input
                type="number"
                min={1}
                value={minesCount}
                onChange={handleMinesChange}
                className={styles.numberInput}
              />
            </label>

            <button
              type="button"
              className={styles.newGameButton}
              onClick={startNewGame}
            >
              New Game
            </button>
          </div>

          <p className={styles.hintText}>
            Left-click to reveal, right-click to flag, double-click a number to chord.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Minesweeper;
