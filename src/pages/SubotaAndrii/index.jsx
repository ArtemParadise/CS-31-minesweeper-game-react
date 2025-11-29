import Board from "./components/Board";
import TopPanel from "./components/TopPanel";
import styles from "./styles/container.module.css";
import useMinesweeper from "./hooks/useMinesweeper";

export default function SubotaAndriiGame() {
    const game = useMinesweeper(16, 16, 40);

    return (
        <div className={styles.gameContainer}>
            <TopPanel
                flagsLeft={game.mines - game.flagsPlaced}
                timer={game.timer}
                onRestart={game.startNewGame}
                status={game.status}
            />

            <Board
                field={game.field}
                onLeftClick={game.openCell}
                onRightClick={game.toggleFlag}
            />
        </div>
    );
}
