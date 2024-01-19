const BoardSolutionTeam = (props) => {
  return (
    <li className={`boardSolution solved${props.solIndex}`}>
      <img className='teamLogo' src={`https://tmssl.akamaized.net/images/wappen/head/${props.teamId}.png`} />
      <span className='boardSolutionText'>
        {props.players.filter(p => !p.includes('TEAM_LOGO')).join(', ')}
        {
          props.players.find(p => p.includes('TEAM_LOGO')) &&
            <span>
              , <img className='miniTeamLogo' src={`https://tmssl.akamaized.net/images/wappen/head/${props.teamId}.png`} />
            </span>
        }
        <br />
        {props.teamName}
      </span>
    </li>
  )
}

export default BoardSolutionTeam
