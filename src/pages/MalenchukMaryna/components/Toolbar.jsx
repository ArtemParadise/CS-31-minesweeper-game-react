import React from "react";
import styles from "../styles/Toolbar.module.css";
import { clamp, formatTime } from "./helpers";

export default function Toolbar({
  difficulty,
  setDifficulty,
  customSettings,
  setCustomSettings,
  onNewGame,
  flagsLeft,
  timeSeconds,
  bestText,
  onToggleTheme,
}) {
  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const handleCustomChange = (field) => (event) => {
    const value = Number(event.target.value) || 0;
    setCustomSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formattedTime = formatTime(timeSeconds);

  const maxMines = Math.max(
    1,
    customSettings.width * customSettings.height - 1
  );

  const clampedMines = clamp(customSettings.mines, 1, maxMines);

  return (
    <section
      className={styles.toolbar}
      aria-label="Панель керування"
    >
      <div className={styles.group}>
        <label className={styles.select}>
          <span>Рівень</span>
          <select
            value={difficulty}
            onChange={handleDifficultyChange}
          >
            <option value="easy">Легка (9×9, 10)</option>
            <option value="medium">Середня (16×16, 40)</option>
            <option value="hard">Важка (30×16, 99)</option>
            <option value="custom">Кастом</option>
          </select>
        </label>

        {difficulty === "custom" && (
          <div className={styles.custom}>
            <label>
              Ширина
              <input
                type="number"
                min="5"
                max="40"
                value={customSettings.width}
                onChange={handleCustomChange("width")}
              />
            </label>
            <label>
              Висота
              <input
                type="number"
                min="5"
                max="30"
                value={customSettings.height}
                onChange={handleCustomChange("height")}
              />
            </label>
            <label>
              Міни
              <input
                type="number"
                min="1"
                max={maxMines}
                value={clampedMines}
                onChange={handleCustomChange("mines")}
              />
            </label>
          </div>
        )}
      </div>

      <div className={styles.group}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={onNewGame}
        >
          Нова гра
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={onToggleTheme}
        >
          Тема
        </button>
      </div>

      <div className={`${styles.group} ${styles.counters}`}>
        <div className={styles.counter} aria-live="polite">
          🚩 <span>{String(flagsLeft).padStart(3, "0")}</span>
        </div>
        <div className={styles.counter} aria-live="polite">
          ⏱️ <span>{formattedTime}</span>
        </div>
        <div className={styles.counter} aria-live="polite">
          🏆 <span>{bestText}</span>
        </div>
      </div>
    </section>
  );
}
