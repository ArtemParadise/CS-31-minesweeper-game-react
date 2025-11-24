// src/pages/HretskyiDanylo/components/Cell.jsx
import { CELL_STATE, GAME_STATE } from "../gameLogic";
import styles from "../styles/Cell.module.css";

export default function Cell({ cell, status, exploded, onOpen, onToggleFlag }) {
  const isFlagged = cell.state === CELL_STATE.FLAGGED;
  const isCovered = cell.state === CELL_STATE.COVERED;

  let classNames = [styles.cell];

  if (status === GAME_STATE.LOSE && cell.mine && !isFlagged) {
    classNames.push(styles.open, styles.mine);
    if (exploded) classNames.push(styles.exploded);
  } else if (isFlagged) {
    classNames.push(styles.closed, styles.flagged);
  } else if (isCovered) {
    classNames.push(styles.closed);
    if (cell.mine) classNames.push(styles.mine);
  } else {
    classNames.push(styles.open);
    if (cell.mine) {
      classNames.push(styles.mine);
      if (exploded) classNames.push(styles.exploded);
    } else if (cell.adj > 0) {
      classNames.push(styles["number" + cell.adj]);
    }
  }

  return (
    <div
      className={classNames.join(" ")}
      onClick={onOpen}
      onContextMenu={onToggleFlag}
    >
      {!cell.mine &&
      cell.state === CELL_STATE.UNCOVERED &&
      cell.adj > 0
        ? cell.adj
        : null}
    </div>
  );
}
