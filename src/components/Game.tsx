import React, { useEffect, useState, ReactElement } from 'react'

const Board = (row: number, cols: number): ReactElement => {
  console.log({ row, cols })
  return (
    <p>
      r{row} c{cols}
    </p>
  )
}

const Game = (): ReactElement => {
  const state = useState({})
  const config = {
    rows: 50,
    cols: 50,
    tickDuration: 200,
  }

  const handleKeyPress = (event: KeyboardEvent): void => {
    console.log(event)
  }

  const gameTick = (): void => {
    console.log('tic-tac')
  }

  useEffect(() => {
    document.body.addEventListener('keydown', handleKeyPress)
    window.gameTick = setInterval(() => {
      gameTick()
    }, config.tickDuration)

    // Cleanup subscription on unmount
    return (): void => {
      document.body.removeEventListener('keydown', handleKeyPress)
      clearInterval(window.gameTick)
    }
  }, [])

  return <div>{Board(config.rows, config.cols)}</div>
}

export { Game }
