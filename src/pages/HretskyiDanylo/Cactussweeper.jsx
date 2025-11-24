// src/pages/HretskyiDanylo/Cactussweeper.jsx
import './styles/global.css';
import { useEffect, useRef, useState } from "react";
import {
  createNewGame,
  openCell,
  toggleFlag,
  countFlags,
  GAME_STATE,
} from "./gameLogic";
import Header from "./components/Header";
import Board from "./components/Board";
import pageStyles from "./styles/Globals.module.css";

const DIFFICULTY_PRESETS = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

export default function Cactussweeper() {
  const [difficulty, setDifficulty] = useState("beginner");
  const [customConfig, setCustomConfig] = useState(null);
  const [game, setGame] = useState(() => {
    const cfg = DIFFICULTY_PRESETS[difficulty];
    return createNewGame(cfg.rows, cfg.cols, cfg.mines);
  });
  const [seconds, setSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const timerRef = useRef(null);
  const boardWrapperRef = useRef(null);

  // Оновлюємо CSS змінні для розміру дошки
  useEffect(() => {
    if (boardWrapperRef.current) {
      const root = boardWrapperRef.current.ownerDocument.documentElement;
      root.style.setProperty('--rows', game.rows);
      root.style.setProperty('--cols', game.cols);
    }
  }, [game.rows, game.cols]);

  // Обробка custom difficulty
  const handleDifficultyChange = (newDifficulty) => {
    if (newDifficulty === "custom") {
      const rows = parseInt(prompt("Number of rows (5–24):", "9"), 10);
      const cols = parseInt(prompt("Number of columns (5–30):", "9"), 10);
      const mines = parseInt(prompt("Number of mines:", "10"), 10);

      if (
        Number.isFinite(rows) && rows >= 5 && rows <= 24 &&
        Number.isFinite(cols) && cols >= 5 && cols <= 30 &&
        Number.isFinite(mines) && mines > 0 && mines < rows * cols
      ) {
        setCustomConfig({ rows, cols, mines });
        setDifficulty("custom");
        const newGame = createNewGame(rows, cols, mines);
        setGame(newGame);
        setSeconds(0);
        setHasStarted(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      } else {
        alert("Invalid parameters. Using Beginner level.");
        setDifficulty("beginner");
        setCustomConfig(null);
      }
    } else {
      setDifficulty(newDifficulty);
      setCustomConfig(null);
    }
  };

  // нова гра при зміні складності
  useEffect(() => {
    if (difficulty === "custom" && customConfig) {
      return; // вже оброблено в handleDifficultyChange
    }
    const cfg = DIFFICULTY_PRESETS[difficulty] || DIFFICULTY_PRESETS.beginner;
    setGame(createNewGame(cfg.rows, cfg.cols, cfg.mines));
    setSeconds(0);
    setHasStarted(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [difficulty, customConfig]);

  // таймер (запускається тільки після першого кліку)
  useEffect(() => {
    if (isPaused || !hasStarted) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (game.status === GAME_STATE.PLAYING && timerRef.current === null) {
      timerRef.current = setInterval(
        () => setSeconds((s) => Math.min(s + 1, 999)),
        1000
      );
    }
    if (game.status !== GAME_STATE.PLAYING && timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [game.status, hasStarted, isPaused]);

  // Алерти при виграші/програші
  useEffect(() => {
    if (game.status === GAME_STATE.WIN) {
      setTimeout(() => alert("Congratulations! You won 🏆"), 50);
    } else if (game.status === GAME_STATE.LOSE) {
      setTimeout(() => alert("OUCH! You hit the cactus 🌵"), 50);
    }
  }, [game.status]);

  const flagsLeft = game.mines - countFlags(game.board);

  const handleReset = () => {
    const cfg = customConfig || DIFFICULTY_PRESETS[difficulty] || DIFFICULTY_PRESETS.beginner;
    setGame(createNewGame(cfg.rows, cfg.cols, cfg.mines));
    setSeconds(0);
    setHasStarted(false);
    setIsPaused(false);
  };

  const handleOpen = (row, col) => {
    if (!hasStarted && game.status === GAME_STATE.PLAYING) {
      setHasStarted(true);
    }
    setGame((prev) => openCell(prev, row, col));
  };

  const handleToggleFlag = (row, col) => {
    setGame((prev) => toggleFlag(prev, row, col));
  };

  const handlePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleHint = () => {
    // Збираємо всі безпечні закриті клітинки
    const safeCells = [];
    for (let row = 0; row < game.rows; row++) {
      for (let col = 0; col < game.cols; col++) {
        const cell = game.board[row][col];
        if (!cell.mine && cell.state === 0) { // COVERED
          safeCells.push({ row, col });
        }
      }
    }

    if (safeCells.length === 0) {
      alert("No safe cells available for hint.");
      return;
    }

    // Вибираємо рандомну безпечну клітинку
    const randomIndex = Math.floor(Math.random() * safeCells.length);
    const { row, col } = safeCells[randomIndex];
    handleOpen(row, col);
  };

  const handleHelp = () => {
    alert("Left click — open a cell, right click — toggle a flag.\nDon't click on the cactus 🌵!");
  };

  return (
    <div className={pageStyles.page} ref={boardWrapperRef}>
      <h1 className={pageStyles.title}>Cactus&apos;sweeper Game</h1>

      <div className={pageStyles.gameBoard}>
        <div className={pageStyles.gameBoardWrapper}>
          <Header
            seconds={seconds}
            flagsLeft={flagsLeft}
            status={game.status}
            difficulty={difficulty}
            onChangeDifficulty={handleDifficultyChange}
            onReset={handleReset}
            onPause={handlePause}
            onHint={handleHint}
            onHelp={handleHelp}
            isPaused={isPaused}
          />

          <div className={pageStyles.gameBoardContent}>
            <Board
              board={game.board}
              status={game.status}
              explodedCell={game.explodedCell}
              onOpen={handleOpen}
              onToggleFlag={handleToggleFlag}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
