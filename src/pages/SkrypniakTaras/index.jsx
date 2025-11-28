import React, { useState, useEffect, useRef, useCallback } from 'react';
import Board from '../../components/SkrypniakTaras/Board';
import Counter from '../../components/SkrypniakTaras/Counter';
import ResetButton from '../../components/SkrypniakTaras/ResetButton';
import styles from '../../components/SkrypniakTaras/Game.module.css';

const ROWS = 10;
const COLS = 10;
const MINES = 10;
const TOTAL = ROWS * COLS;

const createEmptyGrid = () => {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ value: 0, mine: false }))
  );
};

export default function SkrypniakTaras() {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [cellsState, setCellsState] = useState(() =>
    Array.from({ length: TOTAL }, () => ({ revealed: false, flagged: false }))
  );
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [flagsLeft, setFlagsLeft] = useState(MINES);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (started && !gameOver) {
      timerRef.current = setInterval(() => {
        setTime(t => Math.min(999, t + 1));
      }, 1000);
      return () => clearInterval(timerRef.current);
    } else {
      clearInterval(timerRef.current);
    }
  }, [started, gameOver]);

  const inBounds = (r, c) => r >= 0 && r < ROWS && c >= 0 && c < COLS;
  const idx = (r, c) => r * COLS + c;

  const placeMines = useCallback((avoidR, avoidC) => {
    const g = createEmptyGrid();
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if ((r === avoidR && c === avoidC) || g[r][c].mine) continue;
      g[r][c].mine = true;
      placed++;
    }
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1],
    ];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (g[r][c].mine) { g[r][c].value = -1; continue; }
        let count = 0;
        for (const [dr, dc] of directions) {
          const nr = r + dr, nc = c + dc;
          if (inBounds(nr, nc) && g[nr][nc].mine) count++;
        }
        g[r][c].value = count;
      }
    }
    return g;
  }, []);

  const revealCellRecursive = useCallback((g, states, r, c) => {
    const stack = [[r, c]];
    while (stack.length) {
      const [cr, cc] = stack.pop();
      if (!inBounds(cr, cc)) continue;
      const k = idx(cr, cc);
      if (states[k].revealed || states[k].flagged) continue;
      states[k].revealed = true;
      if (g[cr][cc].value === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = cr + dr, nc = cc + dc;
            if (inBounds(nr, nc) && !states[idx(nr,nc)].revealed) {
              stack.push([nr, nc]);
            }
          }
        }
      }
    }
  }, []);

  const checkWin = useCallback((states) => {
    const hidden = states.reduce((acc, s) => acc + (s.revealed ? 0 : 1), 0);
    return hidden === MINES;
  }, []);

  const handleCellClick = (r, c) => {
    if (gameOver) return;
    const k = idx(r, c);

    if (!started) {
      // first click: place mines avoiding this cell
      const newGrid = placeMines(r, c);
      const newStates = cellsState.map(s => ({ ...s }));
      revealCellRecursive(newGrid, newStates, r, c);
      setGrid(newGrid);
      setCellsState(newStates);
      setStarted(true);

      if (newGrid[r][c].mine) {
        setGameOver(true);
        setWin(false);
        clearInterval(timerRef.current);
      } else {
        if (checkWin(newStates)) {
          setGameOver(true);
          setWin(true);
          clearInterval(timerRef.current);
        }
      }
      return;
    }

    const states = cellsState.map(s => ({ ...s }));
    if (states[k].revealed || states[k].flagged) return;

    if (grid[r][c].mine) {
      // reveal all mines and end game (loss)
      for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
          if (grid[i][j].mine) states[idx(i, j)].revealed = true;
        }
      }
      setCellsState(states);
      setGameOver(true);
      setWin(false);
      clearInterval(timerRef.current);
      return;
    }

    revealCellRecursive(grid, states, r, c);
    setCellsState(states);

    if (checkWin(states)) {
      setGameOver(true);
      setWin(true);
      clearInterval(timerRef.current);
    }
  };

  const handleRightClick = (r, c, e) => {
    e.preventDefault();
    if (gameOver) return;
    const k = idx(r, c);
    const states = cellsState.map(s => ({ ...s }));
    if (states[k].revealed) return;
    states[k].flagged = !states[k].flagged;
    setCellsState(states);
    setFlagsLeft(prev => prev + (states[k].flagged ? -1 : 1));
  };

  const restart = () => {
    clearInterval(timerRef.current);
    setGrid(createEmptyGrid());
    setCellsState(Array.from({ length: TOTAL }, () => ({ revealed: false, flagged: false })));
    setStarted(false);
    setGameOver(false);
    setWin(false);
    setFlagsLeft(MINES);
    setTime(0);
  };

  const status = gameOver ? (win ? 'win' : 'loss') : (started ? 'playing' : 'idle');

  return (
    <div className={styles.gameContainer}>
      <div className={styles.controls} id="controls">
        <Counter value={flagsLeft} />
        <ResetButton status={status} onClick={restart} />
        <Counter value={time} />
      </div>

      <Board
        rows={ROWS}
        cols={COLS}
        grid={grid}
        states={cellsState}
        onLeftClick={handleCellClick}
        onRightClick={handleRightClick}
        done={gameOver}
      />
    </div>
  );
}
