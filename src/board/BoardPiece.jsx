const BoardPiece = (props) => {
  return (
    <div>
      {
        props.name.includes('TEAM_LOGO')
          ? <img className='teamLogo' src={`https://tmssl.akamaized.net/images/wappen/head/${props.name.replace(/[^\d]/gu, '')}.png`} />
          : props.name
      }
    </div>
  )
}

export default BoardPiece
