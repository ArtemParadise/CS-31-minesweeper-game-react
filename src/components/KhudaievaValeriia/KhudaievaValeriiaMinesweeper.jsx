// src/components/KhudaievaValeriia/KhudaievaValeriiaMinesweeper.jsx

import React, { useState, useEffect, useCallback } from 'react';
import Board from './Board'; 
import TopBar from './TopBar';
import GameStatusMessage from './GameStatusMessage';

import styles from './KhudaievaValeriiaMinesweeper.module.css';

const INITIAL_ROWS = 10;
const INITIAL_COLS = 10;
const INITIAL_MINES = 15;

const CellState = { CLOSED: "closed", OPEN: "open", FLAGGED: "flagged" };
const GameStatus = { IN_PROGRESS: "in_progress", WIN: "win", LOSE: "lose" };

function createCell(hasMine = false, neighborMines = 0, state = CellState.CLOSED) {
    return {
        hasMine,
        neighborMines,
        state
    };
}

function createEmptyBoard(rows, cols) {
    const board = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row.push(createCell());
        }
        board.push(row);
    }
    return board;
}

function countNeighbourMines(field, row, col, rows, cols) {
    let count = 0;
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (
                r >= 0 && r < rows &&
                c >= 0 && c < cols &&
                !(r === row && c === col)
            ) {
                if (field[r][c].hasMine) count++;
            }
        }
    }
    return count;
}

function generateField(rows, cols, mines) {
    const field = createEmptyBoard(rows, cols);

    let placed = 0;
    while (placed < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

        if (!field[r][c].hasMine) {
            field[r][c].hasMine = true;
            placed++;
        }
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            field[r][c].neighborMines = countNeighbourMines(field, r, c, rows, cols);
        }
    }
    return field;
}

const createInitialBoard = () => {
    return generateField(INITIAL_ROWS, INITIAL_COLS, INITIAL_MINES);
};

function KhudaievaValeriiaMinesweeper() {
    const [board, setBoard] = useState(createInitialBoard());
    const [status, setStatus] = useState(GameStatus.IN_PROGRESS);
    const [timer, setTimer] = useState(0);
    const [flagsLeft, setFlagsLeft] = useState(INITIAL_MINES);
    const [isGameStarted, setIsGameStarted] = useState(false);

    useEffect(() => {
        if (status === GameStatus.IN_PROGRESS && isGameStarted) {
            const timerId = setInterval(() => {
                setTimer(prevTime => prevTime + 1);
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [status, isGameStarted]);

    const checkWin = useCallback((currentBoard) => {
        const nonMineClosedCells = currentBoard.flat().filter(cell => 
            !cell.hasMine && cell.state !== CellState.OPEN
        ).length;
        
        if (nonMineClosedCells === 0 && status === GameStatus.IN_PROGRESS) {
            setStatus(GameStatus.WIN);
        }
    }, [status]);

    const openCell = useCallback((r, c) => {
        
        if (status !== GameStatus.IN_PROGRESS) return;
        if (board[r][c].state !== CellState.CLOSED) return;

        if (!isGameStarted) setIsGameStarted(true);

        const newBoard = board.map(row => [...row]);
        const cell = newBoard[r][c];

        if (cell.hasMine) {
            newBoard[r][c].state = CellState.OPEN;
            setBoard(newBoard);
            setStatus(GameStatus.LOSE);
            return;
        }

        const reveal = (row, col) => {
            if (row < 0 || row >= INITIAL_ROWS || col < 0 || col >= INITIAL_COLS) return;
            const currentCell = newBoard[row][col];

            if (currentCell.state !== CellState.CLOSED || currentCell.hasMine) return;

            newBoard[row][col].state = CellState.OPEN;
            
            if (currentCell.neighborMines === 0) {
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr !== 0 || dc !== 0) {
                            reveal(row + dr, col + dc);
                        }
                    }
                }
            }
        };

        reveal(r, c);
        setBoard(newBoard);
        checkWin(newBoard);
    }, [board, status, isGameStarted, checkWin]);

    const toggleFlag = useCallback((r, c) => {
        if (status !== GameStatus.IN_PROGRESS || board[r][c].state === CellState.OPEN) return;

        const newBoard = board.map(row => [...row]);
        const cell = newBoard[r][c];

        if (cell.state === CellState.CLOSED && flagsLeft > 0) {
            cell.state = CellState.FLAGGED;
            setFlagsLeft(prev => prev - 1);
        } else if (cell.state === CellState.FLAGGED) {
            cell.state = CellState.CLOSED;
            setFlagsLeft(prev => prev + 1);
        }

        setBoard(newBoard);
    }, [board, status, flagsLeft]);
    
    const resetGame = useCallback(() => {
        setBoard(createInitialBoard());
        setStatus(GameStatus.IN_PROGRESS);
        setTimer(0);
        setFlagsLeft(INITIAL_MINES);
        setIsGameStarted(false);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.panel}>
                <h1 className={styles.title}>Minesweeper Game</h1>
                <TopBar 
                    flagsLeft={flagsLeft} 
                    timer={timer} 
                    resetGame={resetGame}
                />

                <div className={styles.gameWrapper}>
                    <Board 
                        board={board} 
                        openCell={openCell} 
                        toggleFlag={toggleFlag} 
                        rows={INITIAL_ROWS}
                        cols={INITIAL_COLS}
                    />
                    
                    <GameStatusMessage status={status} resetGame={resetGame} />
                </div>
            </div>
        </div>
    );
}

export default KhudaievaValeriiaMinesweeper;