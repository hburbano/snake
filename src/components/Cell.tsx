import React, { ReactElement, memo } from 'react'
import './Cell.css'
import clsx from 'clsx'

type Props = {
  pos: string
  isHead: boolean
  isTail: boolean
  isFood: boolean
  isFog: boolean
}

const Cell = (props: Props): ReactElement => {
  const { pos, isHead, isTail, isFood, isFog } = props
  return (
    <div
      key={pos}
      className={clsx(
        'Cell',
        isHead && 'Head',
        isTail && 'Tail',
        isFood && 'Food',
        isFog && 'Fog'
      )}
    />
  )
}

const CellWrapper = memo<Props>(Cell)

export { CellWrapper as Cell }
