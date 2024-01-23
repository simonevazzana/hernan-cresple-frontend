import { useEffect, useRef, useState } from 'react'
import { BOARD_BASE_CHECK, BOARD_MAX_MOVES } from '../../lib/constants'
import { getBackendUrl } from '../../lib/get-backend-url'
import { filterObjectProperties } from '../../lib/object-utils'

import DifficultySelector from '../DifficultySelector'
import { checkBoard, firstScramble, getPlayerClass, insertRandomBadges, swapPlayers } from '../../lib/board-utils'
import { unique } from '../../lib/array-utils'
import BoardPiece from './BoardPiece'
import BoardEnd from './BoardEnd'
import BoardSolution from './BoardSolution'

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
  const [gameProperties, setGameProperties] = useState({ gameResult: 'playing' })
  const [movesLeft, setMovesLeft] = useState(BOARD_MAX_MOVES)
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [check, setCheck] = useState(BOARD_BASE_CHECK)

  useEffect(() => {
    if (!movesLeft && gameProperties.gameResult === 'playing') {
      setGameProperties({
        ...gameProperties,
        gameResult: 'lost'
      })
    }
  }, [movesLeft])

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
    setMovesLeft(movesLeft - 1)
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

    insertRandomBadges({ boardBase })

    const solution = sortSolution({ ...boardBase })
    const board = boardBase.rows.map(r => [...r.players])

    firstScramble({ board, solution })

    const gameProperties = {
      baseBoard: board,
      board,
      solution,
      gameResult: 'playing'
    }

    setGameProperties(gameProperties)
    setMovesLeft(BOARD_MAX_MOVES)
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
            <button onClick={async e => {
              setMovesLeft(0)
            }}
            >
              Give up
            </button>
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
                            <BoardPiece name={player} />
                          </td>
                        ))
                      }
                    </tr>
                  ))
              }
              </tbody>
            </table>
            <span className='moves'>Moves left: {movesLeft}</span>
          </div>
      }
      {
        gameProperties.gameResult === 'playing' &&
          <BoardSolution check={check} solution={gameProperties.solution} forced={false} />
      }
      {
        gameProperties.gameResult !== 'playing' &&
          <BoardEnd gameResult={gameProperties.gameResult} boardBase={gameProperties.boardBase} solution={gameProperties.solution} check={check} />
      }
    </div>
  )
}

export default Board
