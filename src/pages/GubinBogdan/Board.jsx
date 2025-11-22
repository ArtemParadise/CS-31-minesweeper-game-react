import React from "react";
import Cell from "./Cell";
import styles from "./GubinBogdanGame.module.css";

export default function Board({ field, onCellClick, onCellRightClick, gameStatus }) {
  return (
    <div className={styles.board}>
      {field.map((row, rIndex) =>
        row.map((cell, cIndex) => (
          <Cell
            key={`${rIndex}-${cIndex}`}
            data={cell}
            onClick={() => onCellClick(rIndex, cIndex)}
            onRightClick={(e) => onCellRightClick(e, rIndex, cIndex)}
            gameStatus={gameStatus}
          />
        ))
      )}
    </div>
  );
}
