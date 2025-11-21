import styles from './ResetButton.module.css';

export default function ResetButton({ onClick, emoji }) {
  return (
    <button className={styles.smiley} onClick={onClick}>
      {emoji}
    </button>
  );
}
