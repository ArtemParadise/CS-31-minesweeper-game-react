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
      let row = Math.floor(Math.random() * rows);
      let col = Math.floor(Math.random() * cols);
      if (newField[row][col] !== 'M') {
        newField[row][col] = 'M';
        placed++;
      }
    }

    // Count neighbors
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (newField[row][col] !== 'M') {
          newField[row][col] = countNeighborMines(newField, row, col);
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
    directions.forEach(([directionRow, directionCol]) => {
      const neighbourRow = row + directionRow;
      const neighbourCol = col + directionCol;
      if (neighbourRow >= 0 && neighbourRow < rows && neighbourCol >= 0 && neighbourCol < cols && field[neighbourRow][neighbourCol] === 'M') {
        count++;
      }
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
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (field[row][col] !== 'M' && !revealed[row][col]) return false;
      }
    }
    return true;
  };

  // --- Cell Click ---
  const openCell = (row, col) => {
    if (gameOver || win || revealed[row][col] || flags[row][col]) return;

    const newRevealed = revealed.map(r => [...r]);
    const newFlags = flags.map(r => [...r]);

    const revealRecursive = (currentRow, currentCol) => {
      if (currentRow < 0 || currentRow >= rows || currentCol < 0 || currentCol >= cols) return;
      if (newRevealed[currentRow][currentCol] || newFlags[currentRow][currentCol]) return;

      newRevealed[currentRow][currentCol] = true;

      if (field[currentRow][currentCol] === 0) {
        [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
          .forEach(([directionRow, directionCol]) => revealRecursive(currentRow + directionRow, currentCol + directionCol));
      }
    };

    revealRecursive(row, col);

    if (field[row][col] === 'M') {
      setGameOver(true);
      setTimerActive(false);
    } else if (checkWin(newRevealed, field)) {
      setWin(true);
      setTimerActive(false);
    }

    setRevealed(newRevealed);
    setFlags(newFlags);
  };

  const toggleFlag = (row, col, e) => {
    e.preventDefault();
    if (gameOver || win || revealed[row][col]) return;
    const newFlags = flags.map(r => [...r]);
    newFlags[row][col] = !newFlags[row][col];
    setFlags(newFlags);
    setTotalFlags(newFlags.flat().filter(f => f).length);

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
          <input type="number" value={rows} min="5" max="30" onChange={e => setRows(Number(e.target.value))}/> x
          <input type="number" value={cols} min="5" max="30" onChange={e => setCols(Number(e.target.value))}/>
        </label>
        <label>
          Bombs: 
          <input type="number" value={mines} min="1" max={rows * cols - 1} onChange={e => setMines(Number(e.target.value))}/>
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

