import React from "react";
import styles from "../styles/Modal.module.css";

export default function Modal({ open, text, onClose }) {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <p className={styles.text}>{text}</p>
        <button className={styles.okBtn} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}
