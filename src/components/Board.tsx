import React, { ReactElement } from 'react'
import { Cell } from './Cell'
import { overLap } from '../utils'

type Props = {
  rows: number
  cols: number
  head: Vector
}

const Board = (props: Props): ReactElement => {
  const { rows, cols, head } = props
  const cells = []
  let x, y
  for (y = 0; y < rows; y++) {
    for (x = 0; x < cols; x++) {
      const isHead = overLap({ X: x, Y: y }, head)
      const ele = <Cell isHead={isHead} pos={`x-${x}-y${y}`} />
      cells.push(ele)
    }
  }
  return <div className="Board">{cells}</div>
}

export { Board }
