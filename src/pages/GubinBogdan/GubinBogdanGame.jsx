import React, { useState, useEffect } from "react";
import Board from "./Board";
import Timer from "./Timer";
import GameStatus from "./GameStatus";
import RestartButton from "./RestartButton";
import styles from "./GubinBogdanGame.module.css";

const ROWS = 6;
const COLS = 5;
const MINES = 6;

function generateField(rows, cols, mines) {
  const field = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      hasMine: false,
      neighbourMines: 0,
      isOpen: false,
      isFlagged: false,
    }))
  );

  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!field[r][c].hasMine) {
      field[r][c].hasMine = true;
      placed++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      field[r][c].neighbourMines = countNeighbourMines(field, r, c);
    }
  }
  return field;
}

function countNeighbourMines(field, row, col) {
  const dirs = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];
  return dirs.reduce((count, [dr, dc]) => {
    const r = row + dr, c = col + dc;
    if (r >= 0 && r < field.length && c >= 0 && c < field[0].length) {
      if (field[r][c].hasMine) count++;
    }
    return count;
  }, 0);
}

export default function GubinBogdanGame() {
  const [field, setField] = useState(generateField(ROWS, COLS, MINES));
  const [gameStatus, setGameStatus] = useState("idle"); // idle, in-progress, win, lose
  const [flags, setFlags] = useState(MINES);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timer;
    if (gameStatus === "in-progress") {
      timer = setInterval(() => setSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [gameStatus]);

  const startGame = () => {
    setField(generateField(ROWS, COLS, MINES));
    setGameStatus("in-progress");
    setFlags(MINES);
    setSeconds(0);
  };

  const openCell = (row, col) => {
    if (gameStatus !== "in-progress") return;

    const newField = field.map(r => r.map(c => ({ ...c })));
    const cell = newField[row][col];
    if (cell.isOpen || cell.isFlagged) return;

    cell.isOpen = true;
    if (cell.hasMine) {
      setGameStatus("lose");
      revealAll(newField);
      return;
    }

    if (cell.neighbourMines === 0) revealEmptyCells(newField, row, col);

    if (checkWin(newField)) setGameStatus("win");

    setField(newField);
  };

  const toggleFlag = (row, col) => {
    if (gameStatus !== "in-progress") return;
    const newField = field.map(r => r.map(c => ({ ...c })));
    const cell = newField[row][col];
    if (cell.isOpen) return;

    cell.isFlagged = !cell.isFlagged;
    setFlags(flags + (cell.isFlagged ? -1 : 1));
    setField(newField);
  };

  const revealAll = (fld) => {
    fld.forEach(row => row.forEach(c => c.isOpen = true));
    setField([...fld]);
  };

  const revealEmptyCells = (fld, row, col) => {
    const dirs = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
    dirs.forEach(([dr, dc]) => {
      const r = row + dr, c = col + dc;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
        const cell = fld[r][c];
        if (!cell.isOpen && !cell.isFlagged) {
          cell.isOpen = true;
          if (cell.neighbourMines === 0) revealEmptyCells(fld, r, c);
        }
      }
    });
  };

  const checkWin = (fld) => {
    return fld.flat().every(c => (c.hasMine && !c.isOpen) || (!c.hasMine && c.isOpen));
  };

  return (
    <div className={styles.main}>
      <div className={styles.head}>
        <div className={styles.timerStartIndicator}>
          <span>{flags.toString().padStart(3, "0")}</span>
        </div>
        <RestartButton onClick={startGame} />
        <Timer seconds={seconds} />
      </div>
      <Board field={field} onCellClick={openCell} onCellRightClick={toggleFlag} gameStatus={gameStatus} />
      <GameStatus status={gameStatus} />
    </div>
  );
}
