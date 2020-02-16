import React, { ReactElement } from 'react'
import { Cell } from './Cell'
import { overLap, onFog } from '../utils'

type Props = {
  rows: number
  cols: number
  head: Vector
  tail: Vector[]
  food: Vector[]
  fogLevel: number
}

const Board = (props: Props): ReactElement => {
  const { rows, cols, head, tail, food, fogLevel } = props
  const cells = []
  let x, y
  for (y = 0; y < rows; y++) {
    for (x = 0; x < cols; x++) {
      const currentCell = { X: x, Y: y }
      const isHead = overLap(currentCell, head)
      const isTail = !!tail.find(section => overLap(currentCell, section))
      const isFood = !!food.find(section => overLap(currentCell, section))
      const isFog = onFog(currentCell, cols, rows, fogLevel)
      const ele = (
        <Cell
          isHead={isHead}
          isTail={isTail}
          isFood={isFood}
          isFog={isFog}
          pos={`x-${x}-y${y}`}
        />
      )
      cells.push(ele)
    }
  }
  return <div className="Board">{cells}</div>
}

export { Board }
