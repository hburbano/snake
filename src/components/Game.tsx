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

const config = {
  rows: 50,
  cols: 50,
  tickDuration: 30,
  maxFood: 1,
  food: { minDuration: 4000, maxDuration: 10000, score: 1 },
  fogIncrease: 2,
}

type State = {
  head: Vector
  tail: Vector[]
  direction: Vector
  food: VectorTicks[]
  isPlaying: boolean
  fogLevel: number
}

const initialState: State = {
  head: {
    X: Math.floor(config.rows / 2),
    Y: Math.floor(config.cols / 2),
  },
  tail: [],
  direction: DIRECTIONS.UP,
  food: [],
  isPlaying: true,
  fogLevel: 0,
}

const Game = (): ReactElement => {
  const [state, setState] = useState<State>(initialState)
  const [score, setScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(1)

  const reset = (): void => {
    setScore(0)
    setState(initialState)
  }

  const handleKeyPress = (event: KeyboardEvent): void => {
    if (event.defaultPrevented) {
      return // Do nothing if the event was already processed
    }
    switch (event.key) {
      case 'Down':
      case 'ArrowDown':
        if (!opposite(state.direction, DIRECTIONS.DOWN)) {
          setState({ ...state, direction: DIRECTIONS.DOWN })
        }
        event.preventDefault()
        break
      case 'Up':
      case 'ArrowUp':
        if (!opposite(state.direction, DIRECTIONS.UP)) {
          setState({ ...state, direction: DIRECTIONS.UP })
        }
        event.preventDefault()
        break
      case 'Left':
      case 'ArrowLeft':
        if (!opposite(state.direction, DIRECTIONS.LEFT)) {
          setState({ ...state, direction: DIRECTIONS.LEFT })
        }
        event.preventDefault()
        break
      case 'Right':
      case 'ArrowRight':
        if (!opposite(state.direction, DIRECTIONS.RIGHT)) {
          setState({ ...state, direction: DIRECTIONS.RIGHT })
        }
        event.preventDefault()
        break
      case 'Enter':
      case 'Space':
        if (!state.isPlaying) {
          reset()
          event.preventDefault()
        }
        break
      default:
        break
    }
  }

  const executeMove = (): void => {
    // Make next move and check collision of newHead with newTail
    const newTail = [state.head, ...state.tail]
    let newHead = sumVectors(state.direction, state.head)
    newTail.pop()
    let newIsPlaying = !newTail.find(ele => overLap(ele, newHead))

    let newScore = score
    const newFood = state.food
      .map(fruit => ({
        // Update the remain time for each fruit
        ...fruit,
        ticks: fruit.ticks - config.tickDuration,
      }))
      .filter(fruit => {
        // Eat overlapping fruit, remove old fruits.
        const doesOverlap = overLap(newHead, fruit)
        if (doesOverlap) {
          newScore = score + config.food.score
          newTail.push(fruit)
        }
        return fruit.ticks > 0 && !doesOverlap
      })

    // Check collision with boundaries and set newFog, reverse direction if necessary
    const collides = collisionBoundary(newHead, config.cols, config.rows)
    let newDirection = state.direction
    let newFog = state.fogLevel
    if (collides) {
      // Reverse direction and tail if any
      newDirection = reverseVector(newDirection)
      if (newTail.length > 0) {
        newTail.reverse()
        newHead = sumVectors(newTail[0], newDirection)
      }
      newFog += config.fogIncrease
      if (newFog >= Math.floor(Math.min(config.rows, config.cols) / 2))
        newIsPlaying = false
    }

    // Calculate position for new fruits/food
    if (newFood.length < config.maxFood) {
      let newFruit: Vector
      let newFruitHasValidLocation = false
      do {
        newFruit = {
          X: getRandomBetween(newFog, config.cols - newFog),
          Y: getRandomBetween(newFog, config.rows - newFog),
        }
        newFruitHasValidLocation =
          !overLap(newHead, newFruit) &&
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

    setScore(newScore)
    if (newScore > highScore) setHighScore(newScore)

    const newState = {
      ...state,
      head: newHead,
      tail: newTail,
      food: newFood,
      isPlaying: newIsPlaying,
      fogLevel: newFog,
      direction: newDirection,
    }
    setState(newState)

    if (!newState.isPlaying) {
      clearInterval(window.gameTick)
    }
  }

  const executeMoveWrap = useCallback(executeMove, [state])
  const handleKeyPressWrap = useCallback(handleKeyPress, [state])

  useEffect(() => {
    document.body.addEventListener('keydown', handleKeyPressWrap)
    const gameTick = (): void => {
      if (state.isPlaying) executeMoveWrap()
    }
    window.gameTick = setInterval(() => {
      gameTick()
    }, config.tickDuration)
    // Cleanup subscription on unmount
    return (): void => {
      document.body.removeEventListener('keydown', handleKeyPressWrap)
      clearInterval(window.gameTick)
    }
  }, [executeMoveWrap, handleKeyPressWrap, state])

  return (
    <div className="Game">
      <Board
        rows={config.rows}
        cols={config.cols}
        head={state.head}
        tail={state.tail}
        food={state.food}
        fogLevel={state.fogLevel}
      />
      {!state.isPlaying && (
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
