const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
}

export const shuffleMatrix = (matrix) => {
  for (const i in matrix) {
    const column = matrix.map(r => r[i])
    shuffleArray(column)

    for (const j in column) matrix[j][i] = column[j]
  }

  for (const row of matrix) shuffleArray(row)
}

export const unique = (array) => Array.from(new Set(array))
