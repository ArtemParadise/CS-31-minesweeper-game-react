import React from 'react';
import Cell from './Cell';

function Board({ board, onCellClick, onCellRightClick, styles }) {
  return (
    <div className={styles.gameBoard}>
      {board.map((row, r) =>

        row.map((cellData, c) => (
          <Cell
            key={`${r}-${c}`} 
            cellData={cellData}
            styles={styles} 
            onClick={() => onCellClick(r, c)}
            onRightClick={(e) => {
              e.preventDefault(); 
              onCellRightClick(r, c);
            }}
          />
        ))
      )}
    </div>
  );
}

export default React.memo(Board);