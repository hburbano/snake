import React, { ReactElement, memo } from 'react'

type Props = {
  val: number
  key: string
}

const Cell = (props: Props): ReactElement => {
  return (
    <div key={props.key} className="Cell">
      {props.val}
    </div>
  )
}

const CellWrapper = memo<Props>(Cell)

export { CellWrapper as Cell }
