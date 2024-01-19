import BoardSolutionTeam from './BoardSolutionTeam'

const BoardSolution = (props) => {
  const { check, solution, forced } = props
  const { doneRow, doneColumn } = check

  let solutionToDisplay = []

  for (const row of doneRow) {
    if (row.n === 5) {
      const index = solution.rows.findIndex(sRow => sRow.players.includes(row.players[0]) && sRow.players.includes(row.players[1])) + 1
      solutionToDisplay.push(index)
    }
  }

  for (const col of doneColumn) {
    if (col.n === 5) {
      const index = solution.rows.findIndex(sRow => sRow.players.includes(col.players[0]) && sRow.players.includes(col.players[1])) + 1
      solutionToDisplay.push(index)
    }
  }

  if (forced) {
    solutionToDisplay = [0, 1, 2, 3, 4, 5]
  }

  solutionToDisplay.sort()

  return (
    <ul>
      {
        solutionToDisplay.map((solIndex, index) => (
          <BoardSolutionTeam key={index} solIndex={solIndex} players={solIndex ? props.solution.rows[solIndex - 1].players : props.solution.column.players} teamId={solIndex ? props.solution.rows[solIndex - 1].team.teamId : props.solution.column.team.teamId} teamName={solIndex ? props.solution.rows[solIndex - 1].team.teamName : props.solution.column.team.teamName} />
        ))
      }
    </ul>
  )
}

export default BoardSolution
