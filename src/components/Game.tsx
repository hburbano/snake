import React, { useEffect, useState, ReactElement, useCallback } from 'react'
import { Board } from './Board'
import {
  overLap,
  opposite,
  getRandomBetween,
  sumVectors,
  DIRECTIONS,
  collisionBoundary,
  reverseVector,
} from '../utils'
import './Game.css'
import clsx from 'clsx'

type VectorTicks = Vector & {
  ticks: number
}

const Game = (): ReactElement => {
  const config = {
    rows: 50,
    cols: 50,
    tickDuration: 50,
    maxFood: 500,
    food: { minDuration: 4000, maxDuration: 10000, score: 1 },
    fogIncrease: 2,
  }
  // TODO: Replace with reducer
  const [head, setHead] = useState<Vector>({
    X: Math.floor(config.rows / 2),
    Y: Math.floor(config.cols / 2),
  })
  const [tail, setTail] = useState<Vector[]>([])
  const [direction, setDirection] = useState<Vector>(DIRECTIONS.UP)
  const [food, setFood] = useState<VectorTicks[]>([])
  const [score, setScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(1)
  const [isPlaying, setPlay] = useState<boolean>(true)
  const [fogLevel, setFogLevel] = useState<number>(0)

  const reset = (): void => {
    setHead({
      X: Math.floor(config.rows / 2),
      Y: Math.floor(config.cols / 2),
    })
    setTail([])
    setDirection(DIRECTIONS.UP)
    setFood([])
    setScore(0)
    setPlay(true)
    setFogLevel(0)
  }

  const handleKeyPress = (event: KeyboardEvent): void => {
    if (event.defaultPrevented) {
      return // Do nothing if the event was already processed
    }
    switch (event.key) {
      case 'Down':
      case 'ArrowDown':
        if (!opposite(direction, DIRECTIONS.DOWN)) {
          setDirection(DIRECTIONS.DOWN)
        }
        event.preventDefault()
        break
      case 'Up':
      case 'ArrowUp':
        if (!opposite(direction, DIRECTIONS.UP)) {
          setDirection(DIRECTIONS.UP)
        }
        event.preventDefault()
        break
      case 'Left':
      case 'ArrowLeft':
        if (!opposite(direction, DIRECTIONS.LEFT)) {
          setDirection(DIRECTIONS.LEFT)
        }
        event.preventDefault()
        break
      case 'Right':
      case 'ArrowRight':
        if (!opposite(direction, DIRECTIONS.RIGHT)) {
          setDirection(DIRECTIONS.RIGHT)
        }
        event.preventDefault()
        break
      case 'Enter':
      case 'Space':
        if (!isPlaying) {
          reset()
          event.preventDefault()
        }
        break
      default:
        break
    }
  }

  const executeMove = (): void => {
    let newHead = sumVectors(direction, head)
    const newTail: Vector[] = [head, ...tail]
    const newFood = food
      .map(fruit => ({
        ...fruit,
        ticks: fruit.ticks - config.tickDuration,
      }))
      .filter(fruit => {
        const doesOverlap = overLap(head, fruit)
        if (doesOverlap) {
          const newScore = score + config.food.score
          newTail.push(fruit)
          setScore(newScore)
          if (newScore > highScore) setHighScore(newScore)
        }
        return fruit.ticks > 0 && !doesOverlap
      })

    newTail.pop()
    const collides = collisionBoundary(newHead, config.cols, config.rows)
    if (collides) {
      const reverseDirection = reverseVector(direction)
      newTail.reverse()
      if (newTail.length > 0) {
        newHead = sumVectors(newTail[0], reverseDirection)
      }
      setDirection(reverseDirection)
      setFogLevel(fogLevel + config.fogIncrease)
    }

    if (newFood.length < config.maxFood) {
      let newFruit: Vector
      let newFruitHasValidLocation = false
      do {
        newFruit = {
          X: getRandomBetween(fogLevel, config.cols - fogLevel),
          Y: getRandomBetween(fogLevel, config.rows - fogLevel),
        }
        newFruitHasValidLocation =
          !overLap(head, newFruit) &&
          !newTail.find(ele => overLap(ele, newFruit))
      } while (!newFruitHasValidLocation)
      newFood.push({
        ...newFruit,
        ticks: getRandomBetween(
          config.food.minDuration,
          config.food.maxDuration
        ),
      })
    }

    setHead(newHead)
    const crash = !!newTail.find(ele => overLap(ele, newHead))
    if (crash) {
      clearInterval(window.gameTick)
      setPlay(false)
    }
    setTail(newTail)
    setFood(newFood)
  }

  const executeMoveWrap = useCallback(executeMove, [
    head,
    food,
    tail,
    direction,
  ])
  const handleKeyPressWrap = useCallback(handleKeyPress, [direction])

  useEffect(() => {
    document.body.addEventListener('keydown', handleKeyPressWrap)
    const gameTick = (): void => {
      if (isPlaying) executeMoveWrap()
    }
    window.gameTick = setInterval(() => {
      gameTick()
    }, config.tickDuration)
    // Cleanup subscription on unmount
    return (): void => {
      document.body.removeEventListener('keydown', handleKeyPressWrap)
      clearInterval(window.gameTick)
    }
  }, [config.tickDuration, executeMoveWrap, isPlaying, handleKeyPressWrap])

  return (
    <div className="Game">
      <Board
        rows={config.rows}
        cols={config.cols}
        head={head}
        tail={tail}
        food={food}
        fogLevel={fogLevel}
      />
      {!isPlaying && (
        <div className="GameOver">
          <h1>GAME OVER</h1>
          <button onClick={reset}>Play Again</button>
        </div>
      )}
      <div className="Score">
        <h1>Snake Game</h1>
        <p className={clsx(score >= highScore && 'HighScore')}>
          Score: {score}
        </p>
      </div>
    </div>
  )
}

export { Game }
