import { useState } from 'react'
import BoardSolution from './BoardSolution'

const BoardEnd = (props) => {
  const [forcedSolution, setForcedSolution] = useState(false)

  return (
    <div className='boardEnd'>
      {props.gameResult === 'won' && 'Congrats! You won!'}

      {
        props.gameResult === 'lost' &&
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
      <BoardSolution check={props.check} solution={props.solution} forced={forcedSolution} />
    </div>
  )
}

export default BoardEnd
