import React, { ReactElement, memo } from 'react'

type Props = {
  val: number
  pos: string
}

const Cell = (props: Props): ReactElement => {
  const { pos, val } = props
  return (
    <div key={pos} className="Cell">
      {val}
    </div>
  )
}

const CellWrapper = memo<Props>(Cell)

export { CellWrapper as Cell }
