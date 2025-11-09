import React from 'react';
import styles from './Minesweeper.module.css';

function RestartButton({ onClick }) {
  return <button onClick={onClick}>Start / Restart</button>;
}

export default RestartButton;
