import React, { useCallback, useEffect, useRef, useState } from "react";
import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import Modal from "./components/Modal";
import styles from "./styles/Game.module.css";
import {
  bestKey,
  clamp,
  formatTime,
  getNeighborIndices,
  makeEmptyGrid,
  placeMines,
} from "./components/helpers";

const PRESETS = {
  easy: { width: 9, height: 9, mines: 10 },
  medium: { width: 16, height: 16, mines: 40 },
  hard: { width: 30, height: 16, mines: 99 },
};

export default function Minesweeper() {
  // -------- Difficulty (preset/custom) --------
  const [difficulty, setDifficulty] = useState("medium");
  const [customSettings, setCustomSettings] = useState({
    width: 10,
    height: 10,
    mines: 15,
  });

  const width =
    difficulty === "custom"
      ? clamp(customSettings.width, 5, 40)
      : PRESETS[difficulty].width;

  const height =
    difficulty === "custom"
      ? clamp(customSettings.height, 5, 30)
      : PRESETS[difficulty].height;

  const mines =
    difficulty === "custom"
      ? (() => {
          const maxMines = Math.max(1, width * height - 1);
          return clamp(customSettings.mines, 1, maxMines);
        })()
      : PRESETS[difficulty].mines;

  // -------- Game state --------
  const [grid, setGrid] = useState(() => makeEmptyGrid(width, height));
  const [firstClickDone, setFirstClickDone] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [placedFlags, setPlacedFlags] = useState(0);

  // timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef(null);

  // modal
  const [modalState, setModalState] = useState({ open: false, text: "" });

  // best time (state-based)
  const bestKeyStr = bestKey(width, height, mines);
  const [bestTime, setBestTime] = useState(null);

  // підтягуємо best із localStorage при зміні ключа
  useEffect(() => {
    const stored = localStorage.getItem(bestKeyStr);
    setBestTime(stored ? Number(stored) : null);
  }, [bestKeyStr]);

  // -------- Helpers --------
  const flagsLeft = mines - placedFlags;

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(
      () => setElapsedSeconds((seconds) => seconds + 1),
      1000
    );
  }, [stopTimer]);

  const resetGame = useCallback(() => {
    stopTimer();
    setElapsedSeconds(0);
    setPlacedFlags(0);
    setGameOver(false);
    setFirstClickDone(false);
    setGrid(makeEmptyGrid(width, height));
    setModalState({ open: false, text: "" });
  }, [width, height, stopTimer]);

  // reset коли змінюються розміри/міни
  useEffect(() => {
    resetGame();
  }, [width, height, mines, resetGame]);

  // -------- Actions --------
  const openCell = useCallback(
    (cellIndex) => {
      if (gameOver) return;

      setGrid((previousGrid) => {
        const nextGrid = previousGrid.map((cell) => ({ ...cell }));
        const cell = nextGrid[cellIndex];

        if (cell.isOpen || cell.hasFlag) return previousGrid;

        // перший клік — ставимо міни й запускаємо таймер
        if (!firstClickDone) {
          placeMines(nextGrid, width, height, mines, cellIndex);
          setFirstClickDone(true);
          startTimer();
        }

        const openSingleCell = (index) => {
          const targetCell = nextGrid[index];
          if (!targetCell.isOpen && !targetCell.hasFlag) {
            targetCell.isOpen = true;
          }
        };

        openSingleCell(cellIndex);

        // якщо міну відкрили
        if (nextGrid[cellIndex].isMine) {
          nextGrid[cellIndex].exploded = true;
          nextGrid.forEach((gridCell) => {
            if (gridCell.isMine) gridCell.isOpen = true;
          });
          setGameOver(true);
          stopTimer();
          setModalState({
            open: true,
            text: `💥 Програш! Час: ${formatTime(elapsedSeconds)}`,
          });
          return nextGrid;
        }

        // BFS для «нулів»
        if (nextGrid[cellIndex].neighborMines === 0) {
          const queue = [cellIndex];
          const visited = new Set([cellIndex]);

          while (queue.length) {
            const currentIndex = queue.shift();
            const neighborIndices = getNeighborIndices(
              currentIndex,
              width,
              height
            );

            neighborIndices.forEach((neighborIndex) => {
              const neighborCell = nextGrid[neighborIndex];
              if (
                neighborCell.isOpen ||
                neighborCell.hasFlag ||
                neighborCell.isMine
              ) {
                return;
              }

              neighborCell.isOpen = true;

              if (neighborCell.neighborMines === 0 && !visited.has(neighborIndex)) {
                visited.add(neighborIndex);
                queue.push(neighborIndex);
              }
            });
          }
        }

        // перевірка перемоги
        const totalSafeCells = width * height - mines;
        const openedSafeCells = nextGrid.reduce(
          (sum, gridCell) =>
            sum + (gridCell.isOpen && !gridCell.isMine ? 1 : 0),
          0
        );

        if (openedSafeCells === totalSafeCells) {
          stopTimer();
          setGameOver(true);

          const previousBest = localStorage.getItem(bestKeyStr);
          if (previousBest === null || Number(previousBest) > elapsedSeconds) {
            localStorage.setItem(bestKeyStr, String(elapsedSeconds));
            setBestTime(elapsedSeconds);
          }

          setModalState({
            open: true,
            text: `🎉 Перемога! Час: ${formatTime(elapsedSeconds)}`,
          });
        }

        return nextGrid;
      });
    },
    [
      gameOver,
      firstClickDone,
      width,
      height,
      mines,
      elapsedSeconds,
      bestKeyStr,
      startTimer,
      stopTimer,
    ]
  );

  const toggleFlag = useCallback(
    (cellIndex) => {
      if (gameOver) return;

      setGrid((previousGrid) => {
        const nextGrid = previousGrid.map((cell) => ({ ...cell }));
        const targetCell = nextGrid[cellIndex];

        if (targetCell.isOpen) return previousGrid;

        targetCell.hasFlag = !targetCell.hasFlag;
        setPlacedFlags((currentFlags) =>
          currentFlags + (targetCell.hasFlag ? 1 : -1)
        );

        return nextGrid;
      });
    },
    [gameOver]
  );

  const chord = useCallback(
    (centerIndex) => {
      setGrid((previousGrid) => {
        const nextGrid = previousGrid.map((cell) => ({ ...cell }));
        const centerCell = nextGrid[centerIndex];

        if (
          !centerCell.isOpen ||
          centerCell.isMine ||
          centerCell.neighborMines === 0
        ) {
          return previousGrid;
        }

        const neighborIndices = getNeighborIndices(centerIndex, width, height);
        const flagsAround = neighborIndices.filter(
          (index) => nextGrid[index].hasFlag
        ).length;

        if (flagsAround !== centerCell.neighborMines) {
          return previousGrid;
        }

        for (const neighborIndex of neighborIndices) {
          const neighborCell = nextGrid[neighborIndex];

          if (!neighborCell.hasFlag && !neighborCell.isOpen) {
            neighborCell.isOpen = true;

            if (neighborCell.isMine) {
              neighborCell.exploded = true;
              nextGrid.forEach((cell) => {
                if (cell.isMine) cell.isOpen = true;
              });
              stopTimer();
              setGameOver(true);
              setModalState({
                open: true,
                text: `💥 Програш! Час: ${formatTime(elapsedSeconds)}`,
              });
              return nextGrid;
            }

            if (neighborCell.neighborMines === 0) {
              const queue = [neighborIndex];
              const visited = new Set([neighborIndex]);

              while (queue.length) {
                const currentIndex = queue.shift();
                const innerNeighborIndices = getNeighborIndices(
                  currentIndex,
                  width,
                  height
                );

                for (const innerNeighborIndex of innerNeighborIndices) {
                  const innerCell = nextGrid[innerNeighborIndex];
                  if (
                    innerCell.isOpen ||
                    innerCell.hasFlag ||
                    innerCell.isMine
                  ) {
                    continue;
                  }

                  innerCell.isOpen = true;

                  if (
                    innerCell.neighborMines === 0 &&
                    !visited.has(innerNeighborIndex)
                  ) {
                    visited.add(innerNeighborIndex);
                    queue.push(innerNeighborIndex);
                  }
                }
              }
            }
          }
        }

        // win check
        const totalSafeCells = width * height - mines;
        const openedSafeCells = nextGrid.reduce(
          (sum, cell) => sum + (cell.isOpen && !cell.isMine ? 1 : 0),
          0
        );

        if (openedSafeCells === totalSafeCells) {
          stopTimer();
          setGameOver(true);

          const previousBest = localStorage.getItem(bestKeyStr);
          if (previousBest === null || Number(previousBest) > elapsedSeconds) {
            localStorage.setItem(bestKeyStr, String(elapsedSeconds));
            setBestTime(elapsedSeconds);
          }

          setModalState({
            open: true,
            text: `🎉 Перемога! Час: ${formatTime(elapsedSeconds)}`,
          });
        }

        return nextGrid;
      });
    },
    [width, height, mines, elapsedSeconds, bestKeyStr, stopTimer]
  );

  // -------- Theme --------
  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");
    localStorage.setItem("ms-theme", isDark ? "dark" : "light");
  };

  useEffect(() => {
    if (localStorage.getItem("ms-theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const bestText = bestTime != null ? formatTime(bestTime) : "—";

  // -------- UI --------
  return (
    <main className={styles.app}>
      <h1 className={styles.title}>Minesweeper</h1>

      <Toolbar
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        customSettings={customSettings}
        setCustomSettings={setCustomSettings}
        onNewGame={resetGame}
        flagsLeft={flagsLeft}
        timeSeconds={elapsedSeconds}
        bestText={bestText}
        onToggleTheme={toggleTheme}
      />

      <section className={styles.boardWrap}>
        <Board
          grid={grid}
          width={width}
          onOpen={openCell}
          onToggleFlag={toggleFlag}
          onChord={chord}
        />
      </section>

      <Modal
        open={modalState.open}
        text={modalState.text}
        onClose={() => setModalState({ open: false, text: "" })}
      />
    </main>
  );
}
