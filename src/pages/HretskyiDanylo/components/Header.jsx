// src/pages/HretskyiDanylo/components/Header.jsx
import { GAME_STATE } from "../gameLogic";
import styles from "../styles/Header.module.css";

export default function Header({
  seconds,
  flagsLeft,
  status,
  difficulty,
  onChangeDifficulty,
  onReset,
  onPause,
  onHint,
  onHelp,
  isPaused,
}) {
  const timerStr = String(Math.min(seconds, 999)).padStart(3, "0");
  const flagsStr = `🚩 ${String(Math.max(flagsLeft, 0)).padStart(3, "0")}`;

  let label = "NEW GAME";
  let btnClass = styles.resetBtn + " " + styles.stateIdle;
  if (status === GAME_STATE.WIN) {
    label = "YOU WIN";
    btnClass = styles.resetBtn + " " + styles.stateWin;
  }
  if (status === GAME_STATE.LOSE) {
    label = "BOOM!";
    btnClass = styles.resetBtn + " " + styles.stateLose;
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.flags} title="Flags left">{flagsStr}</div>
        <div className={styles.timer} title="Elapsed time">{timerStr}</div>
        <button className={btnClass} onClick={onReset} title="New game / Reset" aria-live="polite">
          {label}
        </button>
      </div>

      <div className={styles.center}></div>

      <div className={styles.right}>
        <label className="sr-only" htmlFor="difficulty">Difficulty</label>
        <select
          id="difficulty"
          className={styles.difficulty}
          value={difficulty}
          onChange={(e) => onChangeDifficulty(e.target.value)}
          title="Difficulty"
        >
          <option value="beginner">Beginner (9×9, 10)</option>
          <option value="intermediate">Intermediate (16×16, 40)</option>
          <option value="expert">Expert (30×16, 99)</option>
          <option value="custom">Custom…</option>
        </select>

        {onPause && (
          <button
            className={`${styles.iconBtn} ${isPaused ? styles.pressed : ""}`}
            onClick={onPause}
            aria-pressed={isPaused}
            title="Pause / Resume"
          >
            ⏸
          </button>
        )}
        {onHint && (
          <button
            className={styles.iconBtn}
            onClick={onHint}
            title="Hint (auto-reveal a safe cell)"
          >
            💡
          </button>
        )}
        {onHelp && (
          <button
            className={styles.iconBtn}
            onClick={onHelp}
            title="How to play"
          >
            ❓
          </button>
        )}
      </div>
    </header>
  );
}
