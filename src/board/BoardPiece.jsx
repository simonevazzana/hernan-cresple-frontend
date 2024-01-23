const BoardPiece = (props) => {
  const { name } = props

  return (
    <div>
      {
        name.includes('TEAM_LOGO')
          ? <img className='teamLogo' src={`https://tmssl.akamaized.net/images/wappen/head/${name.replace(/[^\d]/gu, '')}.png`} />
          : name
      }
    </div>
  )
}

export default BoardPiece
