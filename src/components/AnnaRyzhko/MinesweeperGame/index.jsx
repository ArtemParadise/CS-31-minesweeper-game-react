import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './MinesweeperGame.module.css';
import {
    createInitialGameState,
    generateField,
    openCellLogic,
    CellState,
    GameStatus,
    formatTime,
} from '../minesweeperLogic.js';
import Board from '../Board/index.jsx';
import TopBar from '../TopBar/index.jsx';
import Modal from '../Modal/index.jsx';

/**
 * Основний компонент гри Minesweeper, який керує всім станом.
 */
const MinesweeperGame = () => {
    const [gameState, setGameState] = useState(createInitialGameState);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const timerIntervalRef = useRef(null); // Зберігаємо ID інтервалу

    // СТАН ДЛЯ КЕРУВАННЯ ЗАПУСКОМ ТАЙМЕРА
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // 1. Ініціалізація/Перезапуск гри
    const resetGame = useCallback(() => {
        // Зупинка інтервалу
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }

        const initial = createInitialGameState();
        const newBoard = generateField(initial);

        // Скидаємо стан запуску
        setIsTimerRunning(false);

        setGameState({
            ...initial,
            board: newBoard,
            secondsElapsed: 0,
            status: GameStatus.InProgress,
        });

        setIsModalVisible(false);
    }, []);

    // 2. Логіка Таймера
    useEffect(() => {

        // ЛОГІКА ЗАВЕРШЕННЯ ГРИ: Спрацює, якщо статус Win або Lose
        if (gameState.status !== GameStatus.InProgress) {

            // Зупиняємо інтервал, якщо він був запущений (навіть якщо програли на 1 секунді)
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
            setIsTimerRunning(false);

            // Відкриваємо модальне вікно, оскільки гра завершена
            setIsModalVisible(true);

            return; // Виходимо, щоб не запускати таймер
        }

        // ЛОГІКА ЗАПУСКУ ТАЙМЕРА
        if (gameState.status === GameStatus.InProgress && isTimerRunning) {

            // Якщо інтервал вже працює, не запускаємо його знову
            if (timerIntervalRef.current) return;

            timerIntervalRef.current = setInterval(() => {
                setGameState(prev => {
                    // Якщо статус змінився (Win/Lose), зупиняємо тут і повертаємо prev
                    if (prev.status !== GameStatus.InProgress) {
                        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                        timerIntervalRef.current = null;
                        return prev;
                    }
                    return {
                        ...prev,
                        secondsElapsed: prev.secondsElapsed + 1,
                    };
                });
            }, 1000);
        }

        // Cleanup функція
        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }
        };

    }, [gameState.status, isTimerRunning]); // Залежність тільки від статусу та прапорця запуску

    // 3. Обробник лівого кліку (Відкриття)
    const handleCellClick = useCallback((row, col) => {

        setGameState(prev => {
            if (prev.status !== GameStatus.InProgress) return prev;

            const isFirstClick = prev.secondsElapsed === 0;

            const { newBoard, status } = openCellLogic(
                prev.board,
                prev.rows,
                prev.cols,
                row,
                col
            );

            // Виконуємо консольні логи
            if (status === GameStatus.Lose) {
                console.log(`💥 Програш! Ви відкрили міну на [${row}, ${col}].`);
            } else if (status === GameStatus.Win) {
                console.log("🎉 Перемога! Ви розмінували поле.");
            }

            // ПОВЕРНЕННЯ НОВОГО СТАНУ
            if (isFirstClick && status === GameStatus.InProgress) {
                // Якщо ПЕРШИЙ КЛІК і НЕ програш, запускаємо таймер
                setIsTimerRunning(true);
                return {
                    ...prev,
                    board: newBoard,
                    status: status,
                    secondsElapsed: 1,
                };
            }

            // Всі інші сценарії:
            return {
                ...prev,
                board: newBoard,
                status: status,
            };
        });

    }, []);


    // 4. Обробник правого кліку (Прапорець)
    const handleCellRightClick = useCallback((row, col) => {

        setGameState(prev => {
            if (prev.status !== GameStatus.InProgress) return prev;

            const cell = prev.board[row][col];
            let newFlagsRemaining = prev.flagsRemaining;

            if (cell.state === CellState.Open) return prev;

            const newBoard = prev.board.map((rowArr, r) => rowArr.map((c, cIndex) => {
                if (r === row && cIndex === col) {
                    if (c.state === CellState.Closed && newFlagsRemaining > 0) {
                        newFlagsRemaining--;
                        return { ...c, state: CellState.Flagged };
                    } else if (c.state === CellState.Flagged) {
                        newFlagsRemaining++;
                        return { ...c, state: CellState.Closed };
                    }
                }
                return c;
            }));

            return {
                ...prev,
                board: newBoard,
                flagsRemaining: newFlagsRemaining,
            };
        });

    }, []);

    // 5. Початкова ініціалізація
    useEffect(() => {
        resetGame();
    }, [resetGame]);


    const formattedTime = formatTime(gameState.secondsElapsed);
    const isRestartMode = gameState.status === GameStatus.Lose;

    return (
        <div className={styles.gameContainer}>
            <h1 className={styles.title}>Minesweeper Game (Anna Ryzhko)</h1>

            <div className={styles.panel}>
                <TopBar
                    flagsRemaining={gameState.flagsRemaining}
                    time={formattedTime}
                    onRestartClick={resetGame}
                    isRestartMode={isRestartMode}
                />
                <Board
                    board={gameState.board}
                    rows={gameState.rows}
                    cols={gameState.cols}
                    handleCellClick={handleCellClick}
                    handleCellRightClick={handleCellRightClick}
                />
            </div>

            <Modal
                isVisible={isModalVisible}
                status={gameState.status}
                time={formattedTime}
                onRestart={resetGame}
                onClose={() => setIsModalVisible(false)}
            />
        </div>
    );
};

export default MinesweeperGame;