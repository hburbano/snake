const DIRECTIONS = {
  LEFT: { X: -1, Y: 0 },
  UP: { X: 0, Y: -1 },
  RIGHT: { X: 1, Y: 0 },
  DOWN: { X: 0, Y: 1 },
}

const sumVectors = (a: Vector, b: Vector): Vector => ({
  X: a.X + b.X,
  Y: a.Y + b.Y,
})

const overLap = (a: Vector, b: Vector): boolean => a.X === b.X && a.Y === b.Y

const opposite = (a: Vector, b: Vector): boolean =>
  a.X + b.X === 0 && a.Y + b.Y === 0

export { DIRECTIONS, sumVectors, overLap, opposite }
