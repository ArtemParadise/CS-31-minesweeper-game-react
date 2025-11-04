import React from "react";
import s from "../styles/Toolbar.module.css";
import { clamp, formatTime } from "./helpers";

export default function Toolbar({
  difficulty, setDifficulty, custom, setCustom,
  onNewGame, flagsLeft, time, bestText, onToggleTheme
}) {
  const showCustom = difficulty === "custom";
  const onCustom = (key) => (e) => {
    const v = +e.target.value || 0;
    setCustom((prev) => {
      const width  = key === "width"  ? clamp(v, 5, 40) : prev.width;
      const height = key === "height" ? clamp(v, 5, 30) : prev.height;
      const maxM   = Math.max(1, width * height - 1);
      const mines  = key === "mines"  ? clamp(v, 1, maxM) : clamp(prev.mines, 1, maxM);
      return { width, height, mines };
    });
  };

  return (
    <section className={s.toolbar} aria-label="Панель керування">
      <div className={s.group}>
        <label className={s.select}>
          <span>Рівень</span>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Легка (9×9, 10)</option>
            <option value="medium">Середня (16×16, 40)</option>
            <option value="hard">Важка (30×16, 99)</option>
            <option value="custom">Кастом</option>
          </select>
        </label>

        {showCustom && (
          <div className={s.custom}>
            <label>Ширина <input type="number" min="5" max="40" value={custom.width} onChange={onCustom("width")} /></label>
            <label>Висота <input type="number" min="5" max="30" value={custom.height} onChange={onCustom("height")} /></label>
            <label>Міни   <input type="number" min="1" value={custom.mines} onChange={onCustom("mines")} /></label>
          </div>
        )}
      </div>

      <div className={s.group}>
        <button className={`${s.btn} ${s.primary}`} onClick={onNewGame}>🙂 Нова гра</button>
        <button className={s.btn} onClick={onToggleTheme}>🌓 Тема</button>
      </div>

      <div className={`${s.group} ${s.counters}`}>
        <div className={s.counter}>🚩 <span>{String(flagsLeft).padStart(3, "0")}</span></div>
        <div className={s.counter}>⏱️ <span>{formatTime(time)}</span></div>
        <div className={s.counter}>🏆 <span>{bestText}</span></div>
      </div>
    </section>
  );
}
