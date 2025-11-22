import React from "react";
import styles from "./GubinBogdanGame.module.css";

export default function Cell({ data, onClick, onRightClick, gameStatus }) {
  let className = styles.cell;

  if (data.isOpen) className += ` ${styles.opened}`;
  else className += ` ${styles.closed}`;

  let content = "";
  if (data.isFlagged) content = "⚑";
  else if (data.isOpen) {
    if (data.hasMine) content = "💣";
    else if (data.neighbourMines > 0) content = data.neighbourMines;
  }

  return (
    <div
      className={className}
      onClick={onClick}
      onContextMenu={(e) => { e.preventDefault(); onRightClick(e); }}
    >
      {content}
    </div>
  );
}
