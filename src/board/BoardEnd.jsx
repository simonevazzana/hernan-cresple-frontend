import { useState } from 'react'
import BoardSolution from './BoardSolution'

const BoardEnd = (props) => {
  const { check, gameResult, solution } = props
  const [forcedSolution, setForcedSolution] = useState(false)

  return (
    <div className='boardEnd'>
      {gameResult === 'won' && 'Congrats! You won!'}

      {
        gameResult === 'lost' &&
          <div>
            You lost, better luck next time!
            {
              !forcedSolution &&
                <button onClick={async e => {
                  setForcedSolution(true)
                }}
                >Display solution
                </button>
            }
          </div>
      }
      <br />
      <BoardSolution check={check} solution={solution} forced={forcedSolution} />
    </div>
  )
}

export default BoardEnd
