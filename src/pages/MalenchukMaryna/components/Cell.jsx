import React from "react";
import s from "../styles/Cell.module.css";

export default function Cell({ i, state, onOpen, onToggleFlag, onChord }) {
  const handleClick = () => {
    if (state.isOpen && !state.isMine && state.neighborMines > 0) onChord(i);
    else onOpen(i);
  };
  const onContext = (e) => { e.preventDefault(); onToggleFlag(i); };

  const aria =
    state.isOpen
      ? state.isMine
        ? "Міна"
        : state.neighborMines > 0
          ? `Цифра ${state.neighborMines}`
          : "Порожньо"
      : state.hasFlag ? "Прапорець" : "Закрита клітинка";

  const cls = [
    s.cell,
    state.isOpen ? s.open : s.closed,
    state.hasFlag ? s.flag : "",
    state.isMine && state.isOpen ? `${s.mine} ${s.revealed}` : "",
    state.isMine && state.exploded ? s.exploded : "",
    state.neighborMines ? s[`num${state.neighborMines}`] : "",
  ].join(" ");

  return (
    <button type="button" className={cls} onClick={handleClick} onContextMenu={onContext} aria-label={aria}>
      {state.isOpen && !state.isMine && state.neighborMines > 0 ? state.neighborMines : null}
    </button>
  );
}
