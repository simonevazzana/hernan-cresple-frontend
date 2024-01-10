import { forwardRef, useImperativeHandle, useState } from 'react'
import { CHAIN_DIFFICULTIES, CHAIN_LEAGUES, CHAIN_SEASONS } from '../../lib/constants'

const ChainSelector = forwardRef((props, _ref) => {
  const [difficulty, setDifficulty] = useState('')
  const [league, setLeague] = useState('')
  const [season, setSeason] = useState('')

  useImperativeHandle(_ref, () => ({
    getSelection: () => {
      return {
        difficulty,
        league,
        season
      }
    }
  }))

  return (
    <div>
      <label>
        Select difficulty:
        <select
          id='difficulty'
          value={difficulty}
          placeholder='difficulty'
          onChange={(e) => setDifficulty(e.target.value)}
        >
          {
          CHAIN_DIFFICULTIES.sort((a, b) => b.value - a.value).map(difficulty => (
            <option key={difficulty.value} value={difficulty.value}>{difficulty.tag}</option>
          ))
        }
        </select>
      </label>
      <br />
      <label>
        Select league:
        <select
          id='league'
          value={league}
          placeholder='league'
          onChange={(e) => setLeague(e.target.value)}
        >
          {
          CHAIN_LEAGUES.sort((a, b) => b.value - a.value).map(league => (
            <option key={league.value} value={league.value}>{league.tag}</option>
          ))
        }
        </select>
      </label>
      <br />
      <label>
        Select season:
        <select
          id='season'
          value={season}
          placeholder='season'
          onChange={(e) => setSeason(e.target.value)}
        >
          {
          CHAIN_SEASONS.sort((a, b) => b.value - a.value).map(season => (
            <option key={season.value} value={season.value}>{season.tag}</option>
          ))
        }
        </select>
      </label>
      <br />
    </div>
  )
})

export default ChainSelector
