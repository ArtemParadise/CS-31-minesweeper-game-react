import React, { useState, useEffect } from 'react';
import Board from '../../components/MaliutinMaksym/Board';
import Header from '../../components/MaliutinMaksym/Header';
import {
  generateField,
  revealCell,
  toggleFlagOnCell,
  checkWinCondition,
  GAME_STATUS,
  CELL_STATE,
} from './gameLogic';
import styles from './MaliutinMaksym.module.css';

// Налаштування гри
const ROWS = 10;
const COLS = 10;
const MINES = 10;

const MaliutinMaksymGame = () => {
  // --- СТАН (STATE) ---
  const [board, setBoard] = useState(() => generateField(ROWS, COLS, MINES));
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.READY);
  const [flagsCount, setFlagsCount] = useState(0);

  // --- ЕФЕКТИ (EFFECTS) ---
  // Ефект для перевірки перемоги або поразки
  useEffect(() => {
    if (gameStatus !== GAME_STATUS.PLAYING) return;

    // Перевірка перемоги
    if (checkWinCondition(board, ROWS, COLS, MINES)) {
      setGameStatus(GAME_STATUS.WON);
      alert('You Win!');
    }
  }, [board, gameStatus]); // Запускається при кожній зміні дошки

  // --- ОБРОБНИКИ ПОДІЙ ---

  // Скидання гри
  const handleRestart = () => {
    setBoard(generateField(ROWS, COLS, MINES));
    setGameStatus(GAME_STATUS.READY);
    setFlagsCount(0);
  };

  // Клік лівою кнопкою миші
  const handleCellClick = (row, col) => {
    // Починаємо гру при першому кліку
    if (gameStatus === GAME_STATUS.READY) {
      setGameStatus(GAME_STATUS.PLAYING);
    }
    
    if (gameStatus === GAME_STATUS.WON || gameStatus === GAME_STATUS.LOST) return;

    const { newBoard, gameOver } = revealCell(board, ROWS, COLS, row, col);
    setBoard(newBoard);

    if (gameOver) {
      setGameStatus(GAME_STATUS.LOST);
      alert('Game Over!');
    }
  };

  // Клік правою кнопкою (контекстне меню)
  const handleCellContextMenu = (e, row, col) => {
    e.preventDefault(); // Забороняємо стандартне контекстне меню

    if (gameStatus === GAME_STATUS.READY) {
      setGameStatus(GAME_STATUS.PLAYING);
    }

    if (gameStatus === GAME_STATUS.WON || gameStatus === GAME_STATUS.LOST) return;
    
    const cell = board[row][col];
    if (cell.state === CELL_STATE.OPEN) return; // Не можна ставити прапор на відкриту

    // Обмежуємо кількість прапорів
    if (flagsCount >= MINES && cell.state === CELL_STATE.CLOSED) {
      return;
    }

    const { newBoard, newFlags } = toggleFlagOnCell(board, row, col, flagsCount);
    setBoard(newBoard);
    setFlagsCount(newFlags);
  };

  // --- РЕНДЕРИНГ ---
  const flagsLeft = MINES - flagsCount;

  return (
    <div className={styles.pageWrapper}>
      <h1>Minesweeper</h1>
      <div className={styles.gameBoardWrapper}>
        <Header
          flagsLeft={flagsLeft}
          gameStatus={gameStatus}
          onRestart={handleRestart}
        />
        <Board
          board={board}
          onCellClick={handleCellClick}
          onCellContextMenu={handleCellContextMenu}
        />
      </div>
    </div>
  );
};

export default MaliutinMaksymGame;