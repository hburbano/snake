import React, { useEffect, useState, ReactElement, useCallback } from 'react'
import { Board } from './Board'
import { sumVectors, DIRECTIONS } from '../utils'
import { overLap, opposite } from '../utils'
import './Game.css'

type VectorTicks = Vector & {
  ticks: number
}

const Game = (): ReactElement => {
  const config = {
    rows: 50,
    cols: 50,
    tickDuration: 100,
    maxFruits: 20,
    fruitDuration: 10000,
  }
  // TODO: Replace with reducer
  const [head, setHead] = useState<Vector>({
    X: Math.floor(config.rows / 2),
    Y: Math.floor(config.cols / 2),
  })
  const [tail, setTail] = useState<Vector[]>([])
  const [direction, setDirection] = useState<Vector>(DIRECTIONS.UP)
  const [fruits, setFruits] = useState<VectorTicks[]>([])
  const [score, setScore] = useState<number>(0)
  const [maxScore, setMaxScore] = useState<number>(0)
  const [isPlaying, setPlay] = useState<boolean>(true)

  const handleKeyPress = (event: KeyboardEvent): void => {
    if (event.defaultPrevented) {
      return // Do nothing if the event was already processed
    }
    switch (event.key) {
      case 'Down':
      case 'ArrowDown':
        if (!opposite(direction, DIRECTIONS.DOWN)) setDirection(DIRECTIONS.DOWN)
        event.preventDefault()
        break
      case 'Up':
      case 'ArrowUp':
        if (!opposite(direction, DIRECTIONS.UP)) setDirection(DIRECTIONS.UP)
        event.preventDefault()
        break
      case 'Left':
      case 'ArrowLeft':
        if (!opposite(direction, DIRECTIONS.LEFT)) setDirection(DIRECTIONS.LEFT)
        event.preventDefault()
        break
      case 'Right':
      case 'ArrowRight':
        if (!opposite(direction, DIRECTIONS.RIGHT))
          setDirection(DIRECTIONS.RIGHT)
        event.preventDefault()
        break
      default:
        break
    }
  }

  const executeMove = (): void => {
    const newHead = sumVectors(direction, head)
    setHead(newHead)
    const newTail: Vector[] = [head, ...tail]
    const newFruits = fruits
      .map(fruit => ({
        ...fruit,
        ticks: fruit.ticks - config.tickDuration,
      }))
      .filter(fruit => {
        const doesOverlap = overLap(head, fruit)
        if (doesOverlap) {
          const newScore = score + 5
          newTail.push(fruit)
          setScore(newScore)
          if (newScore > maxScore) setMaxScore(newScore)
        }
        return fruit.ticks > 0 && !doesOverlap
      })
    newTail.pop()
    const crash = !!newTail.find(ele => overLap(ele, newHead))
    if (crash) {
      clearInterval(window.gameTick)
      setPlay(false)
    }

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
      if (isPlaying) executeMoveWrap()
    }
    window.gameTick = setInterval(() => {
      gameTick()
    }, config.tickDuration)

    console.log(window.gameTick)
    // Cleanup subscription on unmount
    return (): void => {
      document.body.removeEventListener('keydown', handleKeyPress)
      clearInterval(window.gameTick)
    }
  }, [config.tickDuration, executeMoveWrap, isPlaying])

  return (
    <div>
      <Board
        rows={config.rows}
        cols={config.cols}
        head={head}
        tail={tail}
        fruits={fruits}
      />
      {!isPlaying && <div>GAME OVER</div>}
      <div>{score}</div>
    </div>
  )
}

export { Game }
