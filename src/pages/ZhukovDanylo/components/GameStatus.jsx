import RestartButton from './RestartButton';
import Timer from './Timer';
import styles from '../styles/GameStatus.module.css';

function formatCounterValue(value) {
  const clampedValue = Math.min(Math.max(value, 0), 999);
  return String(clampedValue).padStart(3, '0');
}

function GameStatus({
  remainingMinesCount,
  elapsedSeconds,
  gameStatus,
  onRestart,
}) {
  return (
    <header className={styles.toolbar}>
      <div className={styles.counter}>
        {formatCounterValue(remainingMinesCount)}
      </div>

      <RestartButton gameStatus={gameStatus} onClick={onRestart} />

      <Timer seconds={elapsedSeconds} />
    </header>
  );
}

export default GameStatus;