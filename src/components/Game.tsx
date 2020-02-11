import React, { useEffect, useState, ReactElement, SetStateAction } from 'react'
import './Game.css'

const Cell = (val: number): ReactElement => {
  return <div className="Cell">{val}</div>
}

const Board = (row: number, cols: number, tick: number): ReactElement => {
  const cells = []
  console.log({ row, cols })
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < cols; j++) {
      const ele = Cell(tick)
      cells.push(ele)
    }
  }
  return <div className="Board">{cells}</div>
}

const Game = (): ReactElement => {
  const [tick, setCount] = useState(0)
  const config = {
    rows: 50,
    cols: 50,
    tickDuration: 200,
  }

  const handleKeyPress = (event: KeyboardEvent): void => {
    console.log(event)
  }

  const gameTick = (
    count: number,
    setTick: React.Dispatch<SetStateAction<number>>
  ): void => {
    setTick((count + 1) % 10)
  }

  useEffect(() => {
    document.body.addEventListener('keydown', handleKeyPress)
    window.gameTick = setInterval(() => {
      gameTick(tick, setCount)
    }, config.tickDuration)

    // Cleanup subscription on unmount
    return (): void => {
      document.body.removeEventListener('keydown', handleKeyPress)
      clearInterval(window.gameTick)
    }
  }, [config.tickDuration, tick])

  return <div>{Board(config.rows, config.cols, tick)}</div>
}

export { Game }
