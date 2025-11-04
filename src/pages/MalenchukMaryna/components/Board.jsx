import React from "react";
import Cell from "./Cell";
import s from "../styles/Board.module.css";

export default function Board({ grid, width, onOpen, onToggleFlag, onChord }) {
  return (
    <div className={s.board} style={{ "--cols": width }} role="grid" aria-label="Ігрове поле" tabIndex={0}>
      {grid.map((cell, i) => (
        <Cell key={i} i={i} state={cell} onOpen={onOpen} onToggleFlag={onToggleFlag} onChord={onChord} />
      ))}
    </div>
  );
}
