import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Chain from './chain/Chain'
import Board from './board/Board'

const App = () => {
  return (
    <BrowserRouter>
      <header>
        <h1>Welcome!</h1>
      </header>
      <Routes>
        <Route
          path='/' element={
            <div>
              <Link to='/chainpions'>
                <h3>
                  Chainpions League
                </h3>
              </Link>
              <Link to='/boardesliga'>
                <h3>
                  Boardesliga
                </h3>
              </Link>
            </div>
        }
        />
        <Route path='/chainpions' element={<Chain />} />
        <Route path='/boardesliga' element={<Board />} />
      </Routes>
    </BrowserRouter>
  )
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(React.createElement(App))
