import React, { useState, useEffect, useCallback } from 'react';
import styles from './ProhvatilovAnton.module.css';

import Board from './Board';
import Timer from './Timer';
import GameStatus from './GameStatus';
import RestartButton from './RestartButton';

const ROWS = 16;
const COLS = 16;
const MINES = 40;

const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1], [1, 0], [1, 1]
];

function createCell(hasMine = false, adjacentMines = 0, state = "closed") {
  return { hasMine, adjacentMines, state }; 
}

function isValidCoordinate(field, row, col) {
  return row >= 0 && row < field.length && col >= 0 && col < field[0].length;
}

function countNeighbourMines(field, row, col) {
  let count = 0;
  for (let [deltaRow, deltaCol] of directions) {
    const neighborRow = row + deltaRow;
    const neighborCol = col + deltaCol;
    if (isValidCoordinate(field, neighborRow, neighborCol) && field[neighborRow][neighborCol].hasMine) {
      count++;
    }
  }
  return count;
}

function generateField(rows, cols, mines) {
  const field = [];
  for (let row = 0; row < rows; row++) {
    const boardRow = [];
    for (let col = 0; col < cols; col++) {
      boardRow.push(createCell());
    }
    field.push(boardRow);
  }
  
  let placedMines = 0;
  while (placedMines < mines) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);
    if (!field[randomRow][randomCol].hasMine) {
      field[randomRow][randomCol].hasMine = true;
      placedMines++;
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!field[row][col].hasMine) {
        field[row][col].adjacentMines = countNeighbourMines(field, row, col);
      }
    }
  }
  return field;
}

function ProhvatilovAntonGame() {
  const [board, setBoard] = useState(() => generateField(ROWS, COLS, MINES));
  const [gameState, setGameState] = useState("in_progress");
  const [time, setTime] = useState(0);
  const [flagCount, setFlagCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    let timerId = null;
    if (gameStarted && gameState === "in_progress") {
      timerId = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [gameStarted, gameState]);

  const handleRestart = useCallback(() => {
    setBoard(generateField(ROWS, COLS, MINES));
    setGameState("in_progress");
    setTime(0);
    setFlagCount(0);
    setGameStarted(false);
  }, []);
  const floodOpen = useCallback((newBoard, row, col) => {
    const cell = newBoard[row][col];
    if (cell.state !== "closed" || cell.hasMine) return;
    
    cell.state = "open";
    
    if (cell.adjacentMines === 0) {
      for (let [deltaRow, deltaCol] of directions) {
        const neighborRow = row + deltaRow;
        const neighborCol = col + deltaCol;
        if (isValidCoordinate(newBoard, neighborRow, neighborCol)) {
          floodOpen(newBoard, neighborRow, neighborCol);
        }
      }
    }
  }, []);

  const checkVictory = (currentBoard) => {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const cell = currentBoard[row][col];
        if (!cell.hasMine && cell.state === "closed") {
          return;
        }
      }
    }
    setGameState("victory");
    setGameStarted(false);
  };
  const revealMines = (newBoard) => {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (newBoard[row][col].hasMine) {
          newBoard[row][col].state = "open";
        }
      }
    }
    return newBoard;
  };

  const handleCellClick = useCallback((row, col) => {
    if (gameState !== "in_progress") return;
    
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    const cell = board[row][col];
    if (cell.state !== "closed") return;
    
    const newBoard = structuredClone(board);

    if (newBoard[row][col].hasMine) {
      setGameState("defeat");
      setGameStarted(false);
      setBoard(revealMines(newBoard));
      alert("💥 Ти програв!");
    } else {
      floodOpen(newBoard, row, col);
      setBoard(newBoard);
      setBoard(currentBoard => {
        checkVictory(currentBoard);
        return currentBoard;
      });
    }
  }, [board, gameState, gameStarted, floodOpen]);

  const handleCellRightClick = useCallback((row, col) => {
    if (gameState !== "in_progress") return;

    if (!gameStarted) {
      setGameStarted(true);
    }

    const cell = board[row][col];
    if (cell.state === "open") return;

    const newBoard = structuredClone(board);
    let newFlagCount = flagCount;

    if (cell.state === "closed") {
      if (flagCount < MINES) {
        newBoard[row][col].state = "flagged";
        newFlagCount++;
      }
    } else if (cell.state === "flagged") {
      newBoard[row][col].state = "closed";
      newFlagCount--;
    }
    
    setFlagCount(newFlagCount);
    setBoard(newBoard);
  }, [board, gameState, flagCount, gameStarted]);
  const remainingMines = MINES - flagCount;

  return (

    <div className={styles.gameBoardWrapper}>
      <h1>Minesweeper Game (React)</h1>
      <div className={styles.gameBoardHeader}>
        
        <GameStatus remainingMines={remainingMines} styles={styles} />
        
        <RestartButton onRestart={handleRestart} gameState={gameState} styles={styles} />
        
        <Timer time={time} styles={styles} />
        
      </div>
      
      <Board 
        board={board} 
        onCellClick={handleCellClick} 
        onCellRightClick={handleCellRightClick}
        styles={styles} 
      />
      
      {gameState === "victory" && <h2>🎉 Перемога!</h2>}
      {gameState === "defeat" && <h2>💥 Поразка!</h2>}
    </div>
  );
}

export default ProhvatilovAntonGame;