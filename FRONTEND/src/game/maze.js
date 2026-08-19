import { GRID_SIZE } from './constants.js'

export function getCellKey(row, column) {
  return `${row}-${column}`
}

function getRandomNumber(maximum) {
  return Math.floor(Math.random() * maximum)
}

/**
 * Creates a new maze with a guaranteed route from the left edge to the right edge.
 * Walls are generated around that route, so every stage stays solvable.
 */
export function createRandomMaze() {
  const startRow = getRandomNumber(GRID_SIZE)
  const finishRow = getRandomNumber(GRID_SIZE)
  const route = new Set([getCellKey(startRow, 0)])

  let currentRow = startRow
  let currentColumn = 0

  // Move right while making occasional vertical moves toward the finish row.
  while (currentColumn < GRID_SIZE - 1) {
    const canMoveVertically = currentRow !== finishRow
    const shouldMoveVertically = canMoveVertically && Math.random() < 0.42

    if (shouldMoveVertically) {
      currentRow += currentRow < finishRow ? 1 : -1
    } else {
      currentColumn += 1
    }

    route.add(getCellKey(currentRow, currentColumn))
  }

  // Finish the route at the chosen row on the right edge.
  while (currentRow !== finishRow) {
    currentRow += currentRow < finishRow ? 1 : -1
    route.add(getCellKey(currentRow, currentColumn))
  }

  const walls = []

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let column = 0; column < GRID_SIZE; column += 1) {
      const key = getCellKey(row, column)
      const isStart = row === startRow && column === 0
      const isFinish = row === finishRow && column === GRID_SIZE - 1

      if (!route.has(key) && !isStart && !isFinish && Math.random() < 0.34) {
        walls.push(key)
      }
    }
  }

  return {
    start: { row: startRow, column: 0 },
    finish: { row: finishRow, column: GRID_SIZE - 1 },
    walls,
  }
}

