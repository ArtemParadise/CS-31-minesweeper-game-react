import Cell from "./Cell";
import styles from "../styles/board.module.css";

export default function Board({ field, onLeftClick, onRightClick }) {
    return (
        <div className={styles.board}>
            {field.map((row, r) =>
                row.map((cell, c) => (
                    <Cell
                        key={`${r}-${c}`}
                        cell={cell}
                        onLeftClick={() => onLeftClick(r, c)}
                        onRightClick={() => onRightClick(r, c)}
                    />
                ))
            )}
        </div>
    );
}