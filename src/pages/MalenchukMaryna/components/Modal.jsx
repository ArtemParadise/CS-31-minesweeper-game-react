import React from "react";
import s from "../styles/Modal.module.css";

export default function Modal({ open, text, onClose }) {
  if (!open) return null;
  return (
    <div className={s.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <p className={s.text}>{text}</p>
        <button className={s.btn} onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
