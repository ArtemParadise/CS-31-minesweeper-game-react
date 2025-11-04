export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
export const pad2 = (n) => String(n).padStart(2, "0");
export const formatTime = (s) => `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;

export const indexFromRowCol = (row, col, w) => row * w + col;
export const isInBounds = (row, col, w, h) =>
  row >= 0 && row < h && col >= 0 && col < w;

export function getNeighborIndices(i, w, h) {
  const r = Math.floor(i / w), c = i % w;
  const out = [];
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const nr = r + dr, nc = c + dc;
      if (isInBounds(nr, nc, w, h)) out.push(indexFromRowCol(nr, nc, w));
    }
  return out;
}

export function makeEmptyGrid(w, h) {
  return Array.from({ length: w * h }, () => ({
    isMine: false, isOpen: false, hasFlag: false, neighborMines: 0,
  }));
}

export function placeMines(grid, w, h, mines, firstClickIndex) {
  const forbidden = new Set([firstClickIndex, ...getNeighborIndices(firstClickIndex, w, h)]);
  let placed = 0;
  while (placed < mines) {
    const i = Math.floor(Math.random() * grid.length);
    if (forbidden.has(i) || grid[i].isMine) continue;
    grid[i].isMine = true; placed++;
  }
  for (let i = 0; i < grid.length; i++) {
    if (grid[i].isMine) { grid[i].neighborMines = 0; continue; }
    grid[i].neighborMines = getNeighborIndices(i, w, h)
      .reduce((acc, j) => acc + (grid[j].isMine ? 1 : 0), 0);
  }
}

export const bestKey = (w, h, m) => `ms-best-${w}x${h}-${m}`;
