import React, { useState, useEffect, useCallback } from 'react';
import styles from './MinesweeperGame.module.css';
import Board from '../Board';
import Modal from '../Modal';
import {
  createGame,
  initializeGame,
  openCell,
  toggleFlag,
  GameStatus,
  formatTime,
} from '../minesweeperLogic.js';

const GAME_ROWS = 10;
const GAME_COLS = 10;
const GAME_MINES = 10;

const MinesweeperGame = () => {
  const [game, setGame] = useState(() => createGame(GAME_ROWS, GAME_COLS, GAME_MINES));
  const [seconds, setSeconds] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let interval = null;
    if (game.status === GameStatus.IN_PROGRESS) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [game.status]);

  useEffect(() => {
    if (game.status === GameStatus.WIN || game.status === GameStatus.LOSE) {
      setShowModal(true);
    }
  }, [game.status]);

  const handleStartGame = () => {
    setGame(createGame(GAME_ROWS, GAME_COLS, GAME_MINES));
    setSeconds(0);
    setShowModal(false);
  };

  const handleCellClick = useCallback((r, c) => {
    if (game.status !== GameStatus.IN_PROGRESS && game.status !== GameStatus.READY) return;

    let newState;
    if (game.firstClick) {
      newState = initializeGame(game, r, c);
    } else {
      newState = openCell(game, r, c);
    }
    setGame({ ...newState.game, board: newState.board });
  }, [game]);

  const handleCellContextMenu = useCallback((r, c) => {
    if (game.status !== GameStatus.IN_PROGRESS) return;
    const newState = toggleFlag(game, r, c);
    setGame({ ...newState.game, board: newState.board });
  }, [game]);

  const handleCloseModal = () => {
    setShowModal(false);
    if (game.status === GameStatus.WIN || game.status === GameStatus.LOSE) {
      setGame(prev => ({...prev, status: 'ended' }));
    }
  };

  const flagsText = String(game.flagsLeft).padStart(3, "0");
  const timeText = formatTime(seconds);
  const buttonText = (game.status === GameStatus.IN_PROGRESS || game.status === GameStatus.READY) ? "🔄 Restart" : "▶ Start";

  return (
    <div className={styles.appContainer}>
      {showModal && (
         <Modal 
           game={game} 
           seconds={seconds} 
           onRestart={handleStartGame}
           onClose={handleCloseModal}
         />
      )}

      <h1 className={styles.title}>Minesweeper</h1>
      <div className={styles.board}>
        <header className={styles.boardHeader}>
          <div className={styles.flags}>🚩 {flagsText}</div>
          <div className={styles.timer}>⏱ {timeText}</div>
        </header>
        
        <Board 
          boardData={game.board}
          onCellClick={handleCellClick}
          onCellContextMenu={handleCellContextMenu}
        />

        <div className={styles.controls}>
          <button className={styles.startBtn} onClick={handleStartGame}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MinesweeperGame;