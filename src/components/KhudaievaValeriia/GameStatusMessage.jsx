// src/components/KhudaievaValeriia/GameStatusMessage.jsx
import React from 'react';
import styles from './GameStatusMessage.module.css';

const GameStatus = { IN_PROGRESS: "in_progress", WIN: "win", LOSE: "lose" };

function GameStatusMessage({ status, resetGame }) {
    if (status === GameStatus.IN_PROGRESS) return null;

    const message = status === GameStatus.WIN 
        ? "🎉 You Won! Click to Restart" 
        : "💣 You Lost! Click to Restart";

    const messageClass = status === GameStatus.WIN 
        ? styles.winMessage 
        : styles.loseMessage;

    return (
        <div 
            className={`${styles.statusMessage} ${messageClass}`}
            onClick={resetGame}
        >
            {message}
        </div>
    );
}
export default GameStatusMessage;