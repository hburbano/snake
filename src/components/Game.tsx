import React, { useEffect, useState, ReactElement, useCallback } from 'react'
import { Board } from './Board'
import { sumVectors, DIRECTIONS } from '../utils'
import { overLap } from '../utils'
import './Game.css'

type VectorTicks = Vector & {
  ticks: number
}

const Game = (): ReactElement => {
  const config = {
    rows: 50,
    cols: 50,
    tickDuration: 100,
    maxFruits: 1,
    fruitDuration: 5000,
  }
  // TODO: Replace with reducer
  const [head, setHead] = useState<Vector>({
    X: Math.floor(config.rows / 2),
    Y: Math.floor(config.cols / 2),
  })
  const [tail, setTail] = useState<Vector[]>([])
  const [direction, setDirection] = useState<Vector>(DIRECTIONS.UP)
  const [fruits, setFruits] = useState<VectorTicks[]>([])

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

  const executeMove = (): void => {
    setHead(sumVectors(direction, head))
    const newTail: Vector[] = [head, ...tail]
    const newFruits = fruits
      .map(fruit => ({
        ...fruit,
        ticks: fruit.ticks - config.tickDuration,
      }))
      .filter(fruit => {
        const doesOverlap = overLap(head, fruit)
        if (doesOverlap) newTail.push(fruit)
        return fruit.ticks > 0 && !doesOverlap
      })
    newTail.pop()

    setTail(newTail)
    if (newFruits.length < config.maxFruits) {
      const newFruit = {
        X: Math.floor(config.cols * Math.random()),
        Y: Math.floor(config.rows * Math.random()),
        ticks: config.fruitDuration,
      }
      newFruits.push(newFruit)
    }
    setFruits(newFruits)
  }

  const executeMoveWrap = useCallback(executeMove, [head, fruits])

  useEffect(() => {
    document.body.addEventListener('keydown', handleKeyPress)
    const gameTick = (): void => {
      executeMoveWrap()
    }
    window.gameTick = setInterval(() => {
      gameTick()
    }, config.tickDuration)

    // Cleanup subscription on unmount
    return (): void => {
      document.body.removeEventListener('keydown', handleKeyPress)
      clearInterval(window.gameTick)
    }
  }, [config.tickDuration, executeMoveWrap])

  return (
    <div>
      <Board
        rows={config.rows}
        cols={config.cols}
        head={head}
        tail={tail}
        fruits={fruits}
      />
    </div>
  )
}

export { Game }
