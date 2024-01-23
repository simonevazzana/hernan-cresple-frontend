const BoardSolutionTeam = (props) => {
  const { players, solIndex, teamId, teamName } = props

  return (
    <li className={`boardSolution solved${solIndex}`}>
      <img className='teamLogo' src={`https://tmssl.akamaized.net/images/wappen/head/${teamId}.png`} />
      <span className='boardSolutionText'>
        {players.filter(p => !p.includes('TEAM_LOGO')).join(', ')}
        {
          players.find(p => p.includes('TEAM_LOGO')) &&
            <span>
              , <img className='miniTeamLogo' src={`https://tmssl.akamaized.net/images/wappen/head/${teamId}.png`} />
            </span>
        }
        <br />
        {teamName}
      </span>
    </li>
  )
}

export default BoardSolutionTeam
