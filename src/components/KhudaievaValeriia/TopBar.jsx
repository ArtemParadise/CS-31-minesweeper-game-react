// src/components/KhudaievaValeriia/TopBar.jsx

import React from 'react';
import FlagCounter from './FlagCounter';
import RestartButton from './RestartButton';
import styles from './TopBar.module.css';

const formatTime = (time) => {
    const currentTime = typeof time === 'number' && time >= 0 ? time : 0;
    const min = String(Math.floor(currentTime / 60)).padStart(2, "0");
    const sec = String(currentTime % 60).padStart(2, "0");
    return `${min}:${sec}`;
};

function TopBar({ flagsLeft, timer, resetGame }) {
    const displayTime = formatTime(timer); 

    return (
        <div className={styles.topbar}>
            <FlagCounter count={flagsLeft} />
            <RestartButton onRestart={resetGame} />
            
            {/*  Використовуємо styles.timer для застосування нового CSS */}
            <div className={styles.timer}>{displayTime}</div> 
        </div>
    );
}

export default TopBar;