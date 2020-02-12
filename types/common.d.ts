export {}
declare global {
  interface Window {
    gameTick: TimeOut
  }

  type Vector = {
    X: number
    Y: number
  }
}
