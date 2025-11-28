import React from "react";
import styles from "./GubinBogdanGame.module.css";

export default function Timer({ seconds }) {
  return (
    <div className={styles.timerStartIndicator}>
      <span>{seconds.toString().padStart(3, "0")}</span>
    </div>
  );
}
