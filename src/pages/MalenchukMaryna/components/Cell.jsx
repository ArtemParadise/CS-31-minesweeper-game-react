import React from "react";
import styles from "../styles/Cell.module.css";

export default function Cell({
  index,
  cell,
  onOpen,
  onToggleFlag,
  onChord,
}) {
  const handleClick = (event) => {
    event.preventDefault();
    if (
      cell.isOpen &&
      !cell.isMine &&
      cell.neighborMines > 0
    ) {
      onChord(index);
    } else {
      onOpen(index);
    }
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    onToggleFlag(index);
  };

  const classNames = [styles.cell];

  if (cell.isOpen) {
    classNames.push(styles.open);
    if (cell.isMine) {
      classNames.push(styles.mine, styles.revealed);
      if (cell.exploded) classNames.push(styles.exploded);
    } else if (cell.neighborMines > 0) {
      classNames.push(
        styles[`num${cell.neighborMines}`] || ""
      );
    }
  } else {
    classNames.push(styles.closed);
    if (cell.hasFlag) classNames.push(styles.flag);
  }

  const content =
    cell.isOpen && !cell.isMine && cell.neighborMines > 0
      ? cell.neighborMines
      : "";

  return (
    <button
      type="button"
      className={classNames.join(" ")}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      aria-label="Клітинка"
    >
      {content}
    </button>
  );
}
