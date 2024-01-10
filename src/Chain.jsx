import { useEffect, useRef, useState } from 'react'
import { CHAIN_MAX_ATTEMPTS } from '../lib/constants'
import { getBackendUrl } from '../lib/get-backend-url'
import { filterObjectProperties } from '../lib/object-utils'

import ChainPlayer from './ChainPlayer'
import ChainSelector from './ChainSelector'
import ChainEnd from './ChainEnd'

const Chain = () => {
  const chainSelectorRef = useRef({})
  const [gameProperties, setGameProperties] = useState({})
  const [attempts, setAttempts] = useState([])
  const [attemptsLeft, setAttemptsLeft] = useState(CHAIN_MAX_ATTEMPTS)
  const [nameSearch, setNameSearch] = useState('')
  const [playersOnSearch, setPlayersOnSearch] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => {
      searchPlayers()
    }, 500)

    const searchPlayers = async () => {
      const res = await fetch(getBackendUrl('v1/player-search'), {
        method: 'POST',
        body: JSON.stringify({ name: nameSearch }),
        headers: { 'Content-Type': 'application/json' }
      })
      const players = await res.json()

      setPlayersOnSearch(players)
    }
    return () => clearTimeout(timer)
  }, [nameSearch])

  useEffect(() => {
    if (!attemptsLeft && gameProperties.gameResult === 'playing') {
      setGameProperties({
        ...gameProperties,
        gameResult: 'lost'
      })
    }
  }, [attemptsLeft])

  const startGame = async () => {
    const { difficulty, league, season } = chainSelectorRef.current.getSelection()

    const startInput = filterObjectProperties({ difficulty, league, season })

    const res = await fetch(getBackendUrl('v1/chain-start'), {
      method: 'POST',
      body: JSON.stringify(startInput),
      headers: { 'Content-Type': 'application/json' }
    })
    if (res.status !== 200) {
      return
    }

    const gameProperties = await res.json()
    gameProperties.gameResult = 'playing'
    setAttemptsLeft(CHAIN_MAX_ATTEMPTS)
    setAttempts([])
    setGameProperties(gameProperties)
  }

  const attempt = async (player) => {
    const validAttempts = attempts.filter(a => a.valid)
    const start = validAttempts.length ? validAttempts.slice(-1)[0].playerId : gameProperties.startPlayer.playerId
    const mid = player.playerId
    const end = gameProperties.endPlayer.playerId

    const res = await fetch(getBackendUrl('v1/valid-link'), {
      method: 'POST',
      body: JSON.stringify({ startId: start, endId: mid }),
      headers: { 'Content-Type': 'application/json' }
    })
    const valid = (await res.json()).valid
    let finished = false

    if (valid) {
      const res = await fetch(getBackendUrl('v1/valid-link'), {
        method: 'POST',
        body: JSON.stringify({ startId: mid, endId: end }),
        headers: { 'Content-Type': 'application/json' }
      })
      finished = (await res.json()).valid

      if (finished) {
        setGameProperties({
          ...gameProperties,
          gameResult: 'won'
        })
      }
    }

    setAttempts([
      ...attempts,
      {
        playerId: player.playerId,
        name: player.name,
        valid,
        finished
      }
    ])
    setAttemptsLeft(attemptsLeft - 1)
  }

  return (
    <div>
      <ChainSelector ref={chainSelectorRef} />
      <button onClick={async e => {
        await startGame()
      }}
      >
        Start Game
      </button>
      {
        gameProperties.startPlayer && gameProperties.endPlayer &&
          <div>
            <ChainPlayer status='start' name={gameProperties.startPlayer.name} playerId={gameProperties.startPlayer.playerId} />

            {
              attempts.map((attempt, index) => (
                <ChainPlayer key={index} status={attempt.valid ? (attempt.finished ? 'finished' : 'valid') : 'not-valid'} name={attempt.name} playerId={attempt.playerId} />
              ))
            }
            {
              gameProperties.gameResult === 'playing' && (
                <label htmlFor='name' className='input'>
                  <input
                    autoComplete='off'
                    id='nameSearch'
                    value={nameSearch}
                    placeholder='Name'
                    onChange={(e) => setNameSearch(e.target.value)}
                  />
                  {
                playersOnSearch.sort((a, b) => b.allTeams.length - a.allTeams.length).slice(0, 10).map(player => (
                  <button
                    key={player.playerId} onClick={async e => {
                      setNameSearch('')
                      setPlayersOnSearch([])
                      await attempt(player)
                    }}
                  >
                    {player.name} - Last team: {player.allTeams.sort((a, b) => b.season - a.season)[0].name}
                  </button>
                ))
                }
                </label>
              )
            }

            <ChainPlayer status='end' name={gameProperties.endPlayer.name} playerId={gameProperties.endPlayer.playerId} />

            {
              gameProperties.gameResult !== 'playing' &&
                <ChainEnd firstLevelLinks={gameProperties.firstLevelLinks} gameResult={gameProperties.gameResult} />
            }
          </div>
      }
    </div>
  )
}

export default Chain
