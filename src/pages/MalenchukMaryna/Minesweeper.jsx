import React, { useCallback, useEffect, useRef, useState } from "react";
import Board from "./components/Board";
import Toolbar from "./components/Toolbar";
import Modal from "./components/Modal";
import g from "./styles/Game.module.css";
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
  const [custom, setCustom] = useState({ width: 10, height: 10, mines: 15 });

  const width  = difficulty === "custom" ? clamp(custom.width, 5, 40)  : PRESETS[difficulty].width;
  const height = difficulty === "custom" ? clamp(custom.height, 5, 30) : PRESETS[difficulty].height;
  const mines  = (() => {
    if (difficulty !== "custom") return PRESETS[difficulty].mines;
    const maxM = Math.max(1, width * height - 1);
    return clamp(custom.mines, 1, maxM);
  })();

  // -------- Game state --------
  const [grid, setGrid] = useState(() => makeEmptyGrid(width, height));
  const [firstClickDone, setFirstClickDone] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [flags, setFlags] = useState(0);

  // timer
  const [sec, setSec] = useState(0);
  const timerRef = useRef(null);

  // modal
  const [modal, setModal] = useState({ open: false, text: "" });

  // best time (СТЕЙТ, не useMemo)
  const bestKeyStr = bestKey(width, height, mines);
  const [bestTime, setBestTime] = useState(null); // number | null

  // підтягуємо best із localStorage при зміні ключа
  useEffect(() => {
    const stored = localStorage.getItem(bestKeyStr);
    setBestTime(stored ? +stored : null);
  }, [bestKeyStr]);

  // -------- Helpers --------
  const flagsLeft = mines - flags;

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => setSec((s) => s + 1), 1000);
  }, [stopTimer]);

  const reset = useCallback(() => {
    stopTimer();
    setSec(0);
    setFlags(0);
    setGameOver(false);
    setFirstClickDone(false);
    setGrid(makeEmptyGrid(width, height));
    setModal({ open: false, text: "" });
    // bestTime не чіпаємо — він підтягується ефектом при зміні bestKeyStr
  }, [width, height, stopTimer]);

  // reset коли змінюються розміри/міни
  useEffect(() => {
    reset();
  }, [width, height, mines, reset]);

  // -------- Actions --------
  const openCell = useCallback(
    (i) => {
      if (gameOver) return;
      setGrid((prev) => {
        const g = prev.map((c) => ({ ...c }));
        const cell = g[i];
        if (cell.isOpen || cell.hasFlag) return prev;

        // перший клік — ставимо міни й запускаємо таймер
        if (!firstClickDone) {
          placeMines(g, width, height, mines, i);
          setFirstClickDone(true);
          startTimer();
        }

        const open = (idx) => {
          const c = g[idx];
          if (!c.isOpen && !c.hasFlag) c.isOpen = true;
        };

        open(i);

        if (g[i].isMine) {
          g[i].exploded = true;
          g.forEach((c) => {
            if (c.isMine) c.isOpen = true;
          });
          setGameOver(true);
          stopTimer();
          setModal({ open: true, text: `💥 Програш! Час: ${formatTime(sec)}` });
          return g;
        }

        // BFS для нулів
        if (g[i].neighborMines === 0) {
          const q = [i];
          const seen = new Set([i]);
          while (q.length) {
            const cur = q.shift();
            for (const nb of getNeighborIndices(cur, width, height)) {
              const c = g[nb];
              if (c.isOpen || c.hasFlag || c.isMine) continue;
              c.isOpen = true;
              if (c.neighborMines === 0 && !seen.has(nb)) {
                seen.add(nb);
                q.push(nb);
              }
            }
          }
        }

        // перевірка перемоги
        const totalSafe = width * height - mines;
        const openedSafe = g.reduce((s, c) => s + (c.isOpen && !c.isMine ? 1 : 0), 0);
        if (openedSafe === totalSafe) {
          stopTimer();
          setGameOver(true);
          const prevBest = localStorage.getItem(bestKeyStr);
          if (prevBest === null || +prevBest > sec) {
            localStorage.setItem(bestKeyStr, String(sec));
            setBestTime(sec); // оновили стейт bestTime
          }
          setModal({ open: true, text: `🎉 Перемога! Час: ${formatTime(sec)}` });
        }

        return g;
      });
    },
    [gameOver, firstClickDone, width, height, mines, sec, bestKeyStr, startTimer, stopTimer]
  );

  const toggleFlag = useCallback(
    (i) => {
      if (gameOver) return;
      setGrid((prev) => {
        const g = prev.map((c) => ({ ...c }));
        const c = g[i];
        if (c.isOpen) return prev;
        c.hasFlag = !c.hasFlag;
        setFlags((f) => f + (c.hasFlag ? 1 : -1));
        return g;
      });
    },
    [gameOver]
  );

  const chord = useCallback(
    (center) => {
      setGrid((prev) => {
        const g = prev.map((c) => ({ ...c }));
        const c = g[center];
        if (!c.isOpen || c.isMine || c.neighborMines === 0) return prev;

        const nbs = getNeighborIndices(center, width, height);
        const flagsAround = nbs.filter((i) => g[i].hasFlag).length;
        if (flagsAround !== c.neighborMines) return prev;

        for (const nb of nbs) {
          if (!g[nb].hasFlag && !g[nb].isOpen) {
            g[nb].isOpen = true;

            if (g[nb].isMine) {
              g[nb].exploded = true;
              g.forEach((x) => {
                if (x.isMine) x.isOpen = true;
              });
              stopTimer();
              setGameOver(true);
              setModal({ open: true, text: `💥 Програш! Час: ${formatTime(sec)}` });
              return g;
            }

            if (g[nb].neighborMines === 0) {
              const q = [nb];
              const seen = new Set([nb]);
              while (q.length) {
                const cur = q.shift();
                for (const k of getNeighborIndices(cur, width, height)) {
                  const cc = g[k];
                  if (cc.isOpen || cc.hasFlag || cc.isMine) continue;
                  cc.isOpen = true;
                  if (cc.neighborMines === 0 && !seen.has(k)) {
                    seen.add(k);
                    q.push(k);
                  }
                }
              }
            }
          }
        }

        // win check
        const totalSafe = width * height - mines;
        const openedSafe = g.reduce((s, cell) => s + (cell.isOpen && !cell.isMine ? 1 : 0), 0);
        if (openedSafe === totalSafe) {
          stopTimer();
          setGameOver(true);
          const prevBest = localStorage.getItem(bestKeyStr);
          if (prevBest === null || +prevBest > sec) {
            localStorage.setItem(bestKeyStr, String(sec));
            setBestTime(sec); // оновили стейт bestTime
          }
          setModal({ open: true, text: `🎉 Перемога! Час: ${formatTime(sec)}` });
        }
        return g;
      });
    },
    [width, height, mines, sec, bestKeyStr, stopTimer]
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
    <main className={g.app}>
      <h1 className={g.title}>Minesweeper</h1>

      <Toolbar
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        custom={custom}
        setCustom={setCustom}
        onNewGame={reset}
        flagsLeft={flagsLeft}
        time={sec}
        bestText={bestText}
        onToggleTheme={toggleTheme}
      />

      <section className={g.boardWrap}>
        <Board
          grid={grid}
          width={width}
          onOpen={openCell}
          onToggleFlag={toggleFlag}
          onChord={chord}
        />
      </section>

      <Modal
        open={modal.open}
        text={modal.text}
        onClose={() => setModal({ open: false, text: "" })}
      />
    </main>
  );
}
