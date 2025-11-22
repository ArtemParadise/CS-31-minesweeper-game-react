import React from "react";
import styles from "./GubinBogdanGame.module.css";

export default function RestartButton({ onClick }) {
  return (
    <button id="start-btn" onClick={onClick}>
      Start / Restart
    </button>
  );
}
