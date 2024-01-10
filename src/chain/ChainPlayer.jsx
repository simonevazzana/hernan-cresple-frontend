import { useState } from 'react'
import { getBackendUrl } from '../../lib/get-backend-url'

const ChainPlayer = (props) => {
  const [finalTeam, setFinalTeam] = useState({})

  const getFinalTeam = async (playerId) => {
    if (finalTeam.name) {
      await setFinalTeam({})
      return
    }

    const res = await fetch(getBackendUrl('v1/final-team'), {
      method: 'POST',
      body: JSON.stringify({ playerId }),
      headers: { 'Content-Type': 'application/json' }
    })

    const fTeam = await res.json()
    await setFinalTeam(fTeam)
  }

  return (
    <div onClick={async e => { getFinalTeam(e.target.id) }} className={`${props.status} player`} id={props.playerId}>
      {props.name}
      {
        finalTeam.name &&
          <span className='finalTeam'>
            Final team: {finalTeam.name}
          </span>
      }
    </div>
  )
}

export default ChainPlayer
