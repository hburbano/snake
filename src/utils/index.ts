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

const getRandomBetween = (min: number, max: number): number =>
  (Math.random() * (max - min) + min) | 0

const collisionBoundary = (
  vector: Vector,
  cols: number,
  rows: number
): boolean =>
  0 > vector.X || vector.X > cols - 1 || 0 > vector.Y || vector.Y > rows - 1

const reverseVector = (vector: Vector): Vector => ({
  X: vector.X * -1,
  Y: vector.Y * -1,
})

const onFog = (
  vector: Vector,
  cols: number,
  rows: number,
  fogLevel: number
): boolean =>
  fogLevel > vector.X ||
  vector.X > cols - fogLevel - 1 ||
  fogLevel > vector.Y ||
  vector.Y > rows - fogLevel - 1

export {
  DIRECTIONS,
  sumVectors,
  overLap,
  opposite,
  getRandomBetween,
  collisionBoundary,
  reverseVector,
  onFog,
}
