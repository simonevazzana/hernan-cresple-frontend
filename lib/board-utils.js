import { shuffleMatrix, unique } from './array-utils'

const checkArray = ({ array, solution }) => {
  let max = { n: 0, players: '' }

  const solArray = [solution.column.players, ...solution.rows.map(row => row.players)]

  for (const index in solArray) {
    const players = solArray[index].filter(n => array.includes(n))

    if (players.length > max.n) max = { n: players.length, players, index }
  }

  return max
}

const checkGameWon = ({ doneRow, doneColumn }) => {
  return (doneColumn.find(c => c.n === 5) && doneRow.every(r => r.n === 5)) || (doneRow.find(r => r.n === 5) && doneColumn.every(c => c.n === 5))
}

export const checkBoard = ({ board, solution }) => {
  const doneColumn = []
  const doneRow = []
  for (const i in board) {
    const row = board[i]
    const column = board.map(r => r[i])

    checkArray({ array: row, solution })
    doneRow.push(checkArray({ array: row, solution }))
    doneColumn.push(checkArray({ array: column, solution }))
  }

  if (checkGameWon({ doneColumn, doneRow })) {
    return {
      doneColumn,
      doneRow,
      won: true
    }
  }

  return {
    doneRow,
    doneColumn,
    won: false
  }
}

export const insertRandomBadges = ({ boardBase }) => {
  const { column } = boardBase
  for (const row of boardBase.rows) {
    const randomNumber = Math.floor(Math.random() * 10) + 1

    if (randomNumber <= 5) {
      if (row.team.teamId === column.team.teamId) {
        const rowIndex = row.players.findIndex(player => column.players.includes(player))
        const colIndex = column.players.findIndex(player => row.players.includes(player))

        row.players[rowIndex] = `TEAM_LOGO_${row.team.teamId}`
        column.players[colIndex] = `TEAM_LOGO_${row.team.teamId}`
      } else {
        let rowIndex
        do {
          rowIndex = Math.floor(Math.random() * row.players.length)
        } while (column.players.includes(row.players[rowIndex]))

        row.players[rowIndex] = `TEAM_LOGO_${row.team.teamId}`
      }
    }
  }
}

export const firstScramble = ({ board, solution }) => {
  let doneRow, doneColumn

  do {
    shuffleMatrix(board)

    const check = checkBoard({ board, solution })
    doneRow = check.doneRow
    doneColumn = check.doneColumn
  } while (doneColumn.find(col => col.n >= 3) || doneRow.find(row => row.n >= 3))
}

export const swapPlayers = ({ board, player1, player2 }) => {
  const rowIndexPlayer1 = board.findIndex(row => row.includes(player1))
  const columnIndexPlayer1 = board[rowIndexPlayer1].findIndex(p => p === player1)

  const rowIndexPlayer2 = board.findIndex(row => row.includes(player2))
  const columnIndexPlayer2 = board[rowIndexPlayer2].findIndex(p => p === player2)

  const t = board[rowIndexPlayer1][columnIndexPlayer1]
  board[rowIndexPlayer1][columnIndexPlayer1] = board[rowIndexPlayer2][columnIndexPlayer2]
  board[rowIndexPlayer2][columnIndexPlayer2] = t

  return board
}

export const getPlayerClass = ({ player, selectedPlayers, rowIndex, colIndex, check }) => {
  const finalClasses = ['boardPiece']

  if (selectedPlayers.includes(player)) finalClasses.push('selected')

  const rowStatus = check.doneRow[rowIndex].players.includes(player) && check.doneRow[rowIndex]
  const colStatus = check.doneColumn[colIndex].players.includes(player) && check.doneColumn[colIndex]

  if (rowStatus.n === 3) finalClasses.push('lightSol')
  if (rowStatus.n === 4) finalClasses.push('midSol')
  if (rowStatus.n === 5) {
    finalClasses.push('solved')
    finalClasses.push(`solved${rowStatus.index}`)
  }

  if (colStatus.n === 3) finalClasses.push('lightSol')
  if (colStatus.n === 4) finalClasses.push('midSol')
  if (colStatus.n === 5) {
    finalClasses.push('solved')
    finalClasses.push(`solved${colStatus.index}`)
  }

  return unique(finalClasses).join(' ')
}
