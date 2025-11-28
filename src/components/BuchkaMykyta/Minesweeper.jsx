import { useState, useEffect } from 'react';
import styles from './Minesweeper.module.css';

export default function Minesweeper() {
  const [rows, setRows] = useState(15);
  const [cols, setCols] = useState(15);
  const [mines, setMines] = useState(50);
  const [grid, setGrid] = useState([]);
  const [flags, setFlags] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [resetEmoji, setResetEmoji] = useState('🙂');

  // Initialize game
  useEffect(() => {
    newGame();
  }, []);

  // Timer effect
  useEffect(() => {
    if (timer && !gameOver && !gameWon) {
      const interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, gameOver, gameWon]);

  const formatTime = (s) => String(Math.min(s, 999)).padStart(3, '0');

  const initializeGame = () => {
    const newGrid = [];
    for (let row = 0; row < rows; row++) {
      const rowArr = [];
      for (let col = 0; col < cols; col++) {
        rowArr.push({
          row,
          col,
          mine: false,
          adj: 0,
          uncovered: false,
          flagged: false,
          exploded: false,
          wrongFlag: false,
        });
      }
      newGrid.push(rowArr);
    }
    return newGrid;
  };

  const newGame = () => {
    const validMines = Math.max(1, Math.min(mines, rows * cols - 1));
    setMines(validMines);
    setGrid(initializeGame());
    setFlags(0);
    setFirstClick(true);
    setSeconds(0);
    setTimer(null);
    setGameOver(false);
    setGameWon(false);
    setResetEmoji('🙂');
  };

  const placeMines = (safeRow, safeCol, gridToModify) => {
    let placed = 0;
    while (placed < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      const cell = gridToModify[row][col];

      if (cell.mine) continue;
      if (Math.abs(row - safeRow) <= 1 && Math.abs(col - safeCol) <= 1) continue;

      cell.mine = true;
      placed++;
    }

    // Calculate adjacent mines
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let count = 0;
        for (let dRow = -1; dRow <= 1; dRow++) {
          for (let dCol = -1; dCol <= 1; dCol++) {
            if (dRow === 0 && dCol === 0) continue;
            const adjRow = row + dRow;
            const adjCol = col + dCol;
            if (
              adjRow >= 0 &&
              adjRow < rows &&
              adjCol >= 0 &&
              adjCol < cols &&
              gridToModify[adjRow][adjCol].mine
            ) {
              count++;
            }
          }
        }
        gridToModify[row][col].adj = count;
      }
    }

    return gridToModify;
  };

  const revealCell = (cell, gridToModify) => {
    if (cell.uncovered || cell.flagged) return;

    cell.uncovered = true;

    if (cell.mine) {
      cell.exploded = true;
      endGame(false, gridToModify, cell);
      return;
    }

    // Flood fill for empty cells
    if (cell.adj === 0) {
      for (let dRow = -1; dRow <= 1; dRow++) {
        for (let dCol = -1; dCol <= 1; dCol++) {
          const adjRow = cell.row + dRow;
          const adjCol = cell.col + dCol;
          if (
            adjRow >= 0 &&
            adjRow < rows &&
            adjCol >= 0 &&
            adjCol < cols
          ) {
            revealCell(gridToModify[adjRow][adjCol], gridToModify);
          }
        }
      }
    }

    cell.uncovered = true;
  };

  const handleCellClick = (cell) => {
    if (gameOver || gameWon || cell.uncovered || cell.flagged) return;

    const newGrid = grid.map((r) => [...r]);

    if (firstClick) {
      placeMines(cell.row, cell.col, newGrid);
      setFirstClick(false);
      setTimer(true);
    }

    revealCell(cell, newGrid);
    setGrid([...newGrid]);
    checkWin(newGrid);
  };

  const handleCellRightClick = (e, cell) => {
    e.preventDefault();
    if (gameOver || gameWon || cell.uncovered) return;

    const newGrid = grid.map((r) => [...r]);
    const cellInGrid = newGrid[cell.row][cell.col];
    cellInGrid.flagged = !cellInGrid.flagged;
    setFlags((prev) => (cellInGrid.flagged ? prev + 1 : prev - 1));
    setGrid(newGrid);
  };

  const handleCellDoubleClick = (cell) => {
    if (!cell.uncovered || cell.adj === 0 || gameOver || gameWon) return;

    let flagCount = 0;
    const covered = [];

    for (let dRow = -1; dRow <= 1; dRow++) {
      for (let dCol = -1; dCol <= 1; dCol++) {
        const adjRow = cell.row + dRow;
        const adjCol = cell.col + dCol;
        if (adjRow >= 0 && adjRow < rows && adjCol >= 0 && adjCol < cols) {
          const n = grid[adjRow][adjCol];
          if (n.flagged) flagCount++;
          else if (!n.uncovered) covered.push(n);
        }
      }
    }

    if (flagCount === cell.adj) {
      const newGrid = grid.map((r) => [...r]);
      covered.forEach((c) => revealCell(c, newGrid));
      setGrid([...newGrid]);
      checkWin(newGrid);
    }
  };

  const endGame = (won, gridToModify) => {
    setTimer(null);
    setGameOver(true);

    if (!won) {
      setResetEmoji('😵');
      // Show all mines
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cell = gridToModify[row][col];
          if (cell.mine && !cell.flagged) {
            cell.uncovered = true;
          }
          if (cell.flagged && !cell.mine) {
            cell.wrongFlag = true;
            cell.uncovered = true;
          }
        }
      }
    } else {
      setResetEmoji('😎');
    }

    setGrid([...gridToModify]);
  };

  const checkWin = (gridToCheck) => {
    let uncovered = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (gridToCheck[row][col].uncovered) uncovered++;
      }
    }

    if (uncovered === rows * cols - mines) {
      setGameWon(true);
      setTimer(null);
      setResetEmoji('😎');
    }
  };

  const getCellContent = (cell) => {
    if (cell.uncovered) {
      if (cell.mine && cell.exploded) return '💥';
      if (cell.mine) return '💣';
      if (cell.adj > 0) return cell.adj;
      return '';
    }
    if (cell.flagged) return '🚩';
    return '';
  };

  const getCellClassName = (cell) => {
    const classes = [styles.cell];

    if (cell.uncovered) {
      classes.push(styles.uncovered);
      if (cell.mine) {
        classes.push(styles.mine);
        if (cell.exploded) classes.push(styles.exploded);
      } else if (cell.adj > 0) {
        classes.push(styles[`number${cell.adj}`]);
      }
      classes.push(styles.disabled);
    }

    if (cell.flagged) {
      classes.push(styles.flag);
    }

    if (cell.wrongFlag) {
      classes.push(styles.wrongFlag);
    }

    return classes.join(' ');
  };

  return (
    <div className={styles.game}>
      {/* Toolbar */}
      <header className={styles.toolbar}>
        <div className={styles.counter}>{formatTime(mines - flags)}</div>
        <button className={styles.smiley} onClick={newGame}>
          {resetEmoji}
        </button>
        <div className={styles.counter}>{formatTime(seconds)}</div>
      </header>

      {/* Game board */}
      <section
        className={styles.board}
        style={{
          gridTemplateColumns: `repeat(${cols}, 25px)`,
        }}
      >
        {grid.map((row) =>
          row.map((cell) => (
            <div
              key={`${cell.row}-${cell.col}`}
              className={getCellClassName(cell)}
              onClick={() => handleCellClick(cell)}
              onContextMenu={(e) => handleCellRightClick(e, cell)}
              onDoubleClick={() => handleCellDoubleClick(cell)}
            >
              {getCellContent(cell)}
            </div>
          ))
        )}
      </section>

      {/* Controls */}
      <footer className={styles.footer}>
        <div className={styles.controls}>
          <label>
            Rows: <input
              type="number"
              min="5"
              max="40"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value, 10))}
            />
          </label>
          <label>
            Cols: <input
              type="number"
              min="5"
              max="60"
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value, 10))}
            />
          </label>
          <label>
            Mines: <input
              type="number"
              min="1"
              value={mines}
              onChange={(e) => setMines(parseInt(e.target.value, 10))}
            />
          </label>
          <button onClick={newGame} className={styles.newGameBtn}>New Game</button>
        </div>
        <p className={styles.hint}>
          Left-click to reveal, right-click to flag. Double-click a number to chord.
        </p>
      </footer>
    </div>
  );
}
