import React from "react";
import Cell from "./Cell";
import styles from "../styles/Board.module.css";

export default function Board({
  grid,
  width,
  height,
  onOpen,
  onToggleFlag,
  onChord,
}) {
  const totalCells = width * height;

  let difficultyClass = styles.easy;
  if (totalCells >= 400) {
    // великі поля (типу 30×16) – робимо клітинки меншими
    difficultyClass = styles.hard;
  } else if (totalCells >= 200) {
    difficultyClass = styles.medium;
  }

  return (
    <div
      className={`${styles.board} ${difficultyClass}`}
      style={{ "--cols": width }}
    >
      {grid.map((cell, index) => (
        <Cell
          key={index}
          index={index}
          cell={cell}
          onOpen={onOpen}
          onToggleFlag={onToggleFlag}
          onChord={onChord}
        />
      ))}
    </div>
  );
}
