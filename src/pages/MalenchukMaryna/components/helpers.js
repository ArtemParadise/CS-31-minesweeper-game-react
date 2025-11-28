export const clamp = (value, min, max) =>
  Math.min(max, Math.max(min, value));

export const pad2 = (n) => String(n).padStart(2, "0");

export const formatTime = (secondsTotal) => {
  const minutes = Math.floor(secondsTotal / 60);
  const seconds = secondsTotal % 60;
  return `${pad2(minutes)}:${pad2(seconds)}`;
};

export const indexFromRowCol = (row, col, width) => row * width + col;

export const isInBounds = (row, col, width, height) =>
  row >= 0 && row < height && col >= 0 && col < width;

/** Повертає одномірні індекси всіх сусідів клітинки */
export function getNeighborIndices(index, width, height) {
  const row = Math.floor(index / width);
  const col = index % width;
  const neighbors = [];

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) continue;

      const neighborRow = row + rowOffset;
      const neighborCol = col + colOffset;

      if (isInBounds(neighborRow, neighborCol, width, height)) {
        neighbors.push(indexFromRowCol(neighborRow, neighborCol, width));
      }
    }
  }

  return neighbors;
}

/** Порожня сітка */
export function makeEmptyGrid(width, height) {
  return Array.from({ length: width * height }, () => ({
    isMine: false,
    isOpen: false,
    hasFlag: false,
    neighborMines: 0,
  }));
}

/** Розстановка мін (перший клік і його сусіди — безпечні) + підрахунок чисел */
export function placeMines(
  grid,
  width,
  height,
  minesCount,
  firstClickIndex
) {
  const forbidden = new Set([
    firstClickIndex,
    ...getNeighborIndices(firstClickIndex, width, height),
  ]);

  let placed = 0;

  while (placed < minesCount) {
    const candidateIndex = Math.floor(Math.random() * grid.length);
    if (forbidden.has(candidateIndex) || grid[candidateIndex].isMine) continue;
    grid[candidateIndex].isMine = true;
    placed += 1;
  }

  for (let index = 0; index < grid.length; index += 1) {
    const cell = grid[index];

    if (cell.isMine) {
      cell.neighborMines = 0;
      continue;
    }

    const neighborIndices = getNeighborIndices(index, width, height);
    const minesAround = neighborIndices.reduce(
      (sum, neighborIndex) => sum + (grid[neighborIndex].isMine ? 1 : 0),
      0
    );

    cell.neighborMines = minesAround;
  }
}

/** Ключ для localStorage під конкретний розмір поля та кількість мін */
export const bestKey = (width, height, minesCount) =>
  `ms-best-${width}x${height}-${minesCount}`;
