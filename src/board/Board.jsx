import { useEffect, useRef, useState } from 'react'
import { BOARD_BASE_CHECK, BOARD_MAX_ATTEMPTS } from '../../lib/constants'
import { getBackendUrl } from '../../lib/get-backend-url'
import { filterObjectProperties } from '../../lib/object-utils'

import DifficultySelector from '../DifficultySelector'
import { checkBoard, firstScramble, getPlayerClass, swapPlayers } from '../../lib/board-utils'
import { unique } from '../../lib/array-utils'

const sortSolution = (solution) => {
  solution.column.players.sort()
  solution.rows.sort((a, b) => (a.team.teamName > b.team.teamName) ? 1 : ((b.team.teamName > a.team.teamName) ? -1 : 0))
  solution.rows.forEach(r => {
    r.players = r.players.sort()
  })

  return solution
}

const Board = () => {
  const difficultySelectorRef = useRef({})
  const [gameProperties, setGameProperties] = useState({})
  const [attemptsLeft, setAttemptsLeft] = useState(BOARD_MAX_ATTEMPTS)
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [check, setCheck] = useState(BOARD_BASE_CHECK)

  useEffect(() => {
    if (!attemptsLeft && gameProperties.gameResult === 'playing') {
      setGameProperties({
        ...gameProperties,
        gameResult: 'lost'
      })
    }
  }, [attemptsLeft])

  useEffect(() => {
    if (selectedPlayers.length <= 1) return

    if (unique(selectedPlayers).length !== selectedPlayers.length) {
      setSelectedPlayers([])
      return
    }

    const newBoard = swapPlayers({ board: gameProperties.board, player1: selectedPlayers[0], player2: selectedPlayers[1] })
    const check = checkBoard({ board: newBoard, solution: gameProperties.solution })

    const newGameProperties = {
      ...gameProperties,
      board: newBoard
    }

    if (check.won) {
      newGameProperties.gameResult = 'won'
    }

    setCheck(check)
    setGameProperties(newGameProperties)
    setSelectedPlayers([])
    setAttemptsLeft(attemptsLeft - 1)
  }, [selectedPlayers])

  const startGame = async () => {
    const { difficulty, league, season } = difficultySelectorRef.current.getSelection()

    const startInput = filterObjectProperties({ difficulty, league, season })

    const res = await fetch(getBackendUrl('v1/generate-board'), {
      method: 'POST',
      body: JSON.stringify(startInput),
      headers: { 'Content-Type': 'application/json' }
    })
    if (res.status !== 200) {
      return
    }

    const boardBase = await res.json()

    const solution = sortSolution({ ...boardBase })
    const board = boardBase.rows.map(r => [...r.players])

    firstScramble({ board, solution })

    const gameProperties = {
      board,
      solution,
      gameResult: 'playing'
    }

    setGameProperties(gameProperties)
    setAttemptsLeft(BOARD_MAX_ATTEMPTS)
    setCheck(BOARD_BASE_CHECK)
    setSelectedPlayers([])
  }

  return (
    <div>
      <DifficultySelector ref={difficultySelectorRef} />
      <button onClick={async e => {
        await startGame()
      }}
      >
        Start Game
      </button>
      {
        gameProperties.board &&
          <div>
            <table>
              <tbody>
                {
                  gameProperties.board.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {
                        row.map((player, colIndex) => (
                          <td
                            key={colIndex} className={getPlayerClass({ player, selectedPlayers, rowIndex, colIndex, check })} onClick={e => {
                              if (gameProperties.gameResult !== 'playing') return
                              setSelectedPlayers([...selectedPlayers, player])
                            }}
                          >
                            {player}
                          </td>
                        ))
                      }
                    </tr>
                  ))
              }
              </tbody>
            </table>
            Attempts left: {attemptsLeft}
          </div>
      }
      {
        gameProperties.gameResult !== 'playing' &&
          <div>
            {
              gameProperties.gameResult === 'won' &&
                <div>
                  Congrats! You won!
                </div>
            }

            {
              gameProperties.gameResult === 'lost' &&
                <div>
                  You lost, better luck next time!
                </div>
            }
          </div>
      }
    </div>
  )
}

export default Board
