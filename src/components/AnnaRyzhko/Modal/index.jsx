import React from 'react';
import styles from './Modal.module.css';
import { GameStatus } from '../minesweeperLogic.js'; // Виправлений шлях

/**
 * Компонент модального вікна для відображення результатів гри.
 */
const Modal = ({ isVisible, status, time, onRestart, onClose }) => {
    if (!isVisible) return null;

    const isWin = status === GameStatus.Win;
    const title = isWin ? "🎉 VICTORY!" : "💥 GAME OVER!";
    const message = isWin
        ? `You cleared the field in <strong>${time}</strong>!`
        : `You hit a mine. Time: <strong>${time}</strong>. Try again!`;

    const boxClass = isWin ? styles.winColor : styles.loseColor;

    return (
        <div className={`${styles.messageOverlay} ${styles.visible}`}>
            <div className={`${styles.messageBox} ${boxClass}`}>
                <button className={styles.closeBtn} onClick={onClose}>✕</button>
                <h2>{title}</h2>
                <p>
                    {isWin ? (
                        <>You cleared the field in <strong>{time}</strong>!</>
                    ) : (
                        <>You hit a mine. Time: <strong>{time}</strong>. Try again!</>
                    )}
                </p>
                <button className={styles.restartBtn} onClick={onRestart}>Play again</button>
            </div>
        </div>
    );
};

export default Modal;