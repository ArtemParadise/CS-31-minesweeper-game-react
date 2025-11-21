import styles from './GameControls.module.css';

export default function GameControls({
  rows,
  cols,
  mines,
  onRowsChange,
  onColsChange,
  onMinesChange,
  onNewGame,
}) {
  return (
    <footer className={styles.footer}>
      <div className={styles.controls}>
        <label>
          Rows: 
          <input
            type="number"
            min="5"
            max="40"
            value={rows}
            onChange={(e) => onRowsChange(parseInt(e.target.value, 10))}
          />
        </label>
        <label>
          Cols: 
          <input
            type="number"
            min="5"
            max="60"
            value={cols}
            onChange={(e) => onColsChange(parseInt(e.target.value, 10))}
          />
        </label>
        <label>
          Mines: 
          <input
            type="number"
            min="1"
            value={mines}
            onChange={(e) => onMinesChange(parseInt(e.target.value, 10))}
          />
        </label>
        <button onClick={onNewGame}>New Game</button>
      </div>
      <p className={styles.hint}>Left-click to reveal, right-click to flag. Double-click a number to chord.</p>
    </footer>
  );
}
