import { useEffect, useState } from "react";

function createCell(hasMine = false, adjacentMines = 0, state = "closed") {
    return { hasMine, adjacentMines, state };
}

function createField(rows, cols) {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => createCell())
    );
}

function countNeighbourMines(field, r, c) {
    let count = 0;
    for (let dr of [-1, 0, 1]) {
        for (let dc of [-1, 0, 1]) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr, nc = c + dc;
            if (field[nr]?.[nc]?.hasMine) count++;
        }
    }
    return count;
}

function generateField(rows, cols, mines) {
    const field = createField(rows, cols);

    let placed = 0;
    while (placed < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (!field[r][c].hasMine) {
            field[r][c].hasMine = true;
            placed++;
        }
    }

    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            field[r][c].adjacentMines = countNeighbourMines(field, r, c);

    return field;
}

export default function useMinesweeper(rows, cols, mines) {
    const [field, setField] = useState(() => generateField(rows, cols, mines));
    const [status, setStatus] = useState("in_progress");
    const [flagsPlaced, setFlags] = useState(0);
    const [opened, setOpened] = useState(0);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (status !== "in_progress") return;

        const id = setInterval(() => setTimer(t => t + 1), 1000);
        return () => clearInterval(id);
    }, [status]);

    function startNewGame() {
        setField(generateField(rows, cols, mines));
        setStatus("in_progress");
        setFlags(0);
        setOpened(0);
        setTimer(0);
    }

    function revealAllMines(clickedR, clickedC) {
        setField(prev =>
            prev.map((row, r) =>
                row.map((cell, c) => {
                    if (cell.hasMine && r === clickedR && c === clickedC) {
                        return { ...cell, state: "exploded" };
                    }
                    if (cell.hasMine && cell.state === "flag") {
                        return { ...cell };
                    }
                    if (cell.hasMine) {
                        return { ...cell, state: "mine" };
                    }
                    if (!cell.hasMine && cell.state === "flag") {
                        return { ...cell, state: "noMineFlag" };
                    }
                    return cell;
                })
            )
        );
    }

    function openCell(r, c) {
        if (status !== "in_progress") return;

        setField(prev => {
            const copy = prev.map(row => row.map(cell => ({ ...cell })));
            const cell = copy[r][c];

            if (cell.state === "open" || cell.state === "flag") return prev;

            if (cell.hasMine) {
                setStatus("lost");
                revealAllMines(r, c);
                return copy;
            }

            function dfs(rr, cc) {
                const cell = copy[rr]?.[cc];
                if (!cell || cell.state === "open" || cell.state === "flag") return;

                cell.state = "open";
                setOpened(o => o + 1);

                if (cell.adjacentMines === 0) {
                    for (let dr of [-1, 0, 1]) {
                        for (let dc of [-1, 0, 1]) {
                            if (dr === 0 && dc === 0) continue;
                            dfs(rr + dr, cc + dc);
                        }
                    }
                }
            }

            dfs(r, c);

            const totalCells = rows * cols;
            if (opened + 1 === totalCells - mines) {
                setStatus("won");
            }

            return copy;
        });
    }

    function toggleFlag(r, c) {
        if (status !== "in_progress") return;

        setField(prev => {
            const copy = prev.map(row => row.map(cell => ({ ...cell })));
            const cell = copy[r][c];

            if (cell.state === "open") return prev;

            if (cell.state === "flag") {
                cell.state = "closed";
                setFlags(f => f - 1);
            } else if (flagsPlaced < mines) {
                cell.state = "flag";
                setFlags(f => f + 1);
            }

            return copy;
        });
    }

    return {
        field,
        mines,
        flagsPlaced,
        timer,
        status,
        startNewGame,
        openCell,
        toggleFlag,
    };
}
