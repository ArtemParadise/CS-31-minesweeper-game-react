// src/components/KhudaievaValeriia/RestartButton.jsx

import React from 'react';
import styles from './RestartButton.module.css';

function RestartButton({ onRestart }) {
    return (
        <button className={styles.startBtn} onClick={onRestart}>
            Start
        </button>
    );
}
export default RestartButton;