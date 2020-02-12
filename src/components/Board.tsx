import React, { ReactElement } from 'react'
import { Cell } from './Cell'
import { overLap } from '../utils'

type Props = {
  rows: number
  cols: number
  head: Vector
  tail: Vector[]
  fruits: Vector[]
}

const Board = (props: Props): ReactElement => {
  const { rows, cols, head, tail, fruits } = props
  const cells = []
  let x, y
  for (y = 0; y < rows; y++) {
    for (x = 0; x < cols; x++) {
      const currentCell = { X: x, Y: y }
      const isHead = overLap(currentCell, head)
      const isTail = !!tail.find(section => overLap(currentCell, section))
      const isFruit = !!fruits.find(section => overLap(currentCell, section))
      const ele = (
        <Cell
          isHead={isHead}
          isTail={isTail}
          isFruit={isFruit}
          pos={`x-${x}-y${y}`}
        />
      )
      cells.push(ele)
    }
  }
  return <div className="Board">{cells}</div>
}

export { Board }
