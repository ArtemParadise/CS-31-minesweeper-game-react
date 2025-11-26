import React from 'react';
import styles from './TopBar.module.css';

/**
 * Компонент верхньої панелі, що включає лічильник прапорців, таймер та кнопку старту/рестарту.
 */
const TopBar = ({ flagsRemaining, time, onRestartClick, isRestartMode }) => {

    // Клас і текст кнопки залежать від isRestartMode, який передається з MinesweeperGame
    const buttonClass = isRestartMode ? `${styles.startBtn} ${styles.restart}` : styles.startBtn;
    const buttonText = isRestartMode ? "Restart" : "Start";

    return (
        <div className={styles.topbar}>
            <div className={styles.counter}>{String(flagsRemaining).padStart(3, '0')}</div>

            <button
                className={buttonClass}
                onClick={onRestartClick}
            >
                {buttonText}
            </button>

            <div className={styles.timer}>{time}</div>
        </div>
    );
};

export default TopBar;