import styles from './Toolbar.module.css';
import MineCounter from './MineCounter';
import ResetButton from './ResetButton';
import Timer from './Timer';

export default function Toolbar({ minesRemaining, onReset, emoji, seconds }) {
  return (
    <header className={styles.toolbar}>
      <MineCounter minesRemaining={minesRemaining} />
      <ResetButton onClick={onReset} emoji={emoji} />
      <Timer seconds={seconds} />
    </header>
  );
}
