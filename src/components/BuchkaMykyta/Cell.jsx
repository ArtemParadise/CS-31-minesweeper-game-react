import styles from './Cell.module.css';

export default function Cell({ cell, onClick, onRightClick, onDoubleClick }) {
  const getClassName = () => {
    let classes = [styles.cell];
    
    if (cell.uncovered) {
      classes.push(styles.uncovered);
      if (cell.mine) {
        classes.push(styles.mine);
        if (cell.exploded) {
          classes.push(styles.exploded);
        }
      } else if (cell.adj > 0) {
        classes.push(styles[`number${cell.adj}`]);
      }
      classes.push(styles.disabled);
    }
    
    if (cell.flagged) {
      classes.push(styles.flag);
    }
    
    if (cell.wrongFlag) {
      classes.push(styles.wrongFlag);
    }
    
    return classes.join(' ');
  };

  const getCellContent = () => {
    if (cell.uncovered) {
      if (cell.mine && cell.exploded) return '💥';
      if (cell.mine) return '💣';
      if (cell.adj > 0) return cell.adj;
      return '';
    }
    if (cell.flagged) return '🚩';
    return '';
  };

  return (
    <div
      className={getClassName()}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick();
      }}
      onDoubleClick={onDoubleClick}
      title={`Row ${cell.row}, Col ${cell.col}`}
    >
      {getCellContent()}
    </div>
  );
}
