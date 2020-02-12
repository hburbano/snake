import React, { ReactElement, memo } from 'react'
import './Cell.css'
import clsx from 'clsx'

type Props = {
  pos: string
  isHead: boolean
  isTail: boolean
  isFruit: boolean
}

const Cell = (props: Props): ReactElement => {
  const { pos, isHead, isTail, isFruit } = props
  return (
    <div
      key={pos}
      className={clsx(
        'Cell',
        isHead && 'Head',
        isTail && 'Tail',
        isFruit && 'Fruit'
      )}
    />
  )
}

const CellWrapper = memo<Props>(Cell)

export { CellWrapper as Cell }
