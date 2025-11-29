import styles from "../styles/cell.module.css";

export default function Cell({ cell, onLeftClick, onRightClick }) {
    let className = styles.cell;

    if (cell.state === "closed") className += " " + styles.closed;
    if (cell.state === "open") className += " " + styles.open;
    if (cell.state === "flag") className += " " + styles.flag;
    if (cell.state === "mine") className += " " + styles.mine;
    if (cell.state === "exploded") className += " " + styles.exploded;
    if (cell.state === "noMineFlag") className += " " + styles.noMineFlag;

    return (
        <div
            className={className}
            onClick={onLeftClick}
            onContextMenu={(e) => { e.preventDefault(); onRightClick(); }}
        >
            {cell.state === "open" && cell.adjacentMines > 0 && cell.adjacentMines}
        </div>
    );
}