const ChainEnd = (props) => {
  return (
    <div>
      {
        props.gameResult === 'won' &&
          <div>
            Congrats! You won!
          </div>
      }

      {
        props.gameResult === 'lost' &&
          <div>
            You lost, better luck next time!
          </div>
      }
      <h2>You could've won in one move if you tried: </h2>
      {
        props.firstLevelLinks.map(l => (
          <div key={l.playerId} className='solution'>{l.name}</div>
        ))
      }
    </div>
  )
}

export default ChainEnd
