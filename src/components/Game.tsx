import React, { useEffect, useState, ReactElement } from 'react'
import { Board } from './Board'
import { sumVectors, DIRECTIONS } from '../utils'
import './Game.css'

const Game = (): ReactElement => {
  const config = {
    rows: 50,
    cols: 50,
    tickDuration: 200,
  }
  // TODO: Replace with reducer
  const [head, setHead] = useState<Vector>({
    X: Math.floor(config.rows / 2),
    Y: Math.floor(config.cols / 2),
  })
  const [direction, setDirection] = useState<Vector>(DIRECTIONS.UP)

  const handleKeyPress = (event: KeyboardEvent): void => {
    if (event.defaultPrevented) {
      return // Do nothing if the event was already processed
    }
    switch (event.key) {
      case 'Down':
      case 'ArrowDown':
        setDirection(DIRECTIONS.DOWN)
        event.preventDefault()
        break
      case 'Up':
      case 'ArrowUp':
        setDirection(DIRECTIONS.UP)
        event.preventDefault()
        break
      case 'Left':
      case 'ArrowLeft':
        setDirection(DIRECTIONS.LEFT)
        event.preventDefault()
        break
      case 'Right':
      case 'ArrowRight':
        setDirection(DIRECTIONS.RIGHT)
        event.preventDefault()
        break
      default:
        break
    }
  }

  useEffect(() => {
    document.body.addEventListener('keydown', handleKeyPress)
    const gameTick = (): void => {
      setHead(sumVectors(direction, head))
    }
    window.gameTick = setInterval(() => {
      gameTick()
    }, config.tickDuration)

    // Cleanup subscription on unmount
    return (): void => {
      document.body.removeEventListener('keydown', handleKeyPress)
      clearInterval(window.gameTick)
    }
  }, [config.tickDuration, head])

  return (
    <div>
      <Board rows={config.rows} cols={config.cols} head={head} />
    </div>
  )
}

export { Game }
