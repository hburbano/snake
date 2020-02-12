import React, { ReactElement, memo } from 'react'
import './Cell.css'
import clsx from 'clsx'

type Props = {
  pos: string
  isHead: boolean
}

const Cell = (props: Props): ReactElement => {
  const { pos, isHead } = props
  return <div key={pos} className={clsx('Cell', isHead && 'Head')} />
}

const CellWrapper = memo<Props>(Cell)

export { CellWrapper as Cell }
