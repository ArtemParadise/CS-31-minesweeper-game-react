import styles from '../styles/RestartButton.module.css';

function RestartButton({ gameStatus, onClick }) {
  let emoji = '🙂';

  if (gameStatus === 'won') {
    emoji = '😎';
  } else if (gameStatus === 'lost') {
    emoji = '😵';
  }

  return (
    <button
      type="button"
      className={styles.restartButton}
      onClick={onClick}
    >
      {emoji}
    </button>
  );
}

export default RestartButton;