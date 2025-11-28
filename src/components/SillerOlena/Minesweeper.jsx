import React, { useState, useEffect } from 'react';
import Board from './Board';
import StatusBar from './StatusBar';
import RestartButton from './RestartButton';
import GameOverModal from './GameOverModal';
import WinModal from './WinModal';
import styles from './Minesweeper.module.css';

function Minesweeper() {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [mines, setMines] = useState(20);

  const [field, setField] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [flags, setFlags] = useState([]);
  const [totalFlags, setTotalFlags] = useState(0);

  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  // --- Timer ---
  useEffect(() => {
    let timer;
    if (timerActive) {
      timer = setInterval(() => setSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive]);

  // --- Generate Field ---
  const generateField = () => {
    let newField = Array.from({ length: rows }, () => Array(cols).fill(0));

    // Place mines
    let placed = 0;
    while (placed < mines) {
      let r = Math.floor(Math.random() * rows);
      let c = Math.floor(Math.random() * cols);
      if (newField[r][c] !== 'M') {
        newField[r][c] = 'M';
        placed++;
      }
    }

    // Count neighbors
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newField[r][c] !== 'M') {
          newField[r][c] = countNeighborMines(newField, r, c);
        }
      }
    }
    return newField;
  };

  const countNeighborMines = (field, row, col) => {
    const directions = [
      [-1,-1],[-1,0],[-1,1],
      [0,-1],       [0,1],
      [1,-1],[1,0],[1,1]
    ];
    let count = 0;
    directions.forEach(([dx,dy]) => {
      const r = row + dx;
      const c = col + dy;
      if (r>=0 && r<rows && c>=0 && c<cols && field[r][c]==='M') count++;
    });
    return count;
  };

  // --- Initialize Game ---
  const initializeGame = () => {
    const newField = generateField();
    setField(newField);
    setRevealed(Array.from({ length: rows }, () => Array(cols).fill(false)));
    setFlags(Array.from({ length: rows }, () => Array(cols).fill(false)));
    setTotalFlags(0);
    setSeconds(0);
    setGameOver(false);
    setWin(false);
    setTimerActive(true);
  };

  // --- Check Win ---
  const checkWin = (revealed, field) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (field[r][c] !== 'M' && !revealed[r][c]) return false;
      }
    }
    return true;
  };

  // --- Cell Click ---
  const openCell = (r, c) => {
    if (gameOver || win || revealed[r][c] || flags[r][c]) return;

    const newRevealed = revealed.map(row => [...row]);
    const newFlags = flags.map(row => [...row]);

    const revealRecursive = (row, col) => {
      if (row<0 || row>=rows || col<0 || col>=cols) return;
      if (newRevealed[row][col] || newFlags[row][col]) return;

      newRevealed[row][col] = true;

      if (field[row][col] === 0) {
        [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
          .forEach(([dx,dy]) => revealRecursive(row+dx,col+dy));
      }
    };

    revealRecursive(r,c);

    if (field[r][c]==='M') {
      setGameOver(true);
      setTimerActive(false);
    } else if (checkWin(newRevealed, field)) {
      setWin(true);
      setTimerActive(false);
    }

    setRevealed(newRevealed);
    setFlags(newFlags);
  };

  const toggleFlag = (r, c, e) => {
    e.preventDefault();
    if (gameOver || win || revealed[r][c]) return;
    const newFlags = flags.map(row => [...row]);
    newFlags[r][c] = !newFlags[r][c];
    setFlags(newFlags);
    setTotalFlags(newFlags.flat().filter(f=>f).length);

    if (checkWin(revealed, field)) {
      setWin(true);
      setTimerActive(false);
    }
  };

  // --- Initial render ---
  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div className={styles.gameContainer}>
      <h1>Minesweeper</h1>

      <div className={styles.settings}>
        <label>
          Board size: 
          <input type="number" value={rows} min="5" max="30" onChange={e=>setRows(Number(e.target.value))}/> x
          <input type="number" value={cols} min="5" max="30" onChange={e=>setCols(Number(e.target.value))}/>
        </label>
        <label>
          Bombs: 
          <input type="number" value={mines} min="1" max={rows*cols-1} onChange={e=>setMines(Number(e.target.value))}/>
        </label>
        <RestartButton onClick={initializeGame}/>
      </div>

      <StatusBar bombs={mines} flags={totalFlags} time={seconds}/>

      {field.length > 0 &&
        <Board field={field} revealed={revealed} flags={flags} 
          onCellClick={openCell} onRightClick={toggleFlag} />
      }

      {gameOver && <GameOverModal onRestart={initializeGame}/>}
      {win && <WinModal onRestart={initializeGame}/>}
    </div>
  );
}

export default Minesweeper;
