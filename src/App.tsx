import React, { ReactElement } from 'react'
import './App.css'
import { Game } from './components/Game'

const App = (): ReactElement => {
  return (
    <div className="App" role="main">
      <Game />
      <footer>
        Source at{' '}
        <a className="App-link" href="https://github.com/Nslaver/snake">
          Github
        </a>
      </footer>
    </div>
  )
}

export default App
