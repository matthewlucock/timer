class Clock {
  private running: boolean = false
  private lastFrameTime: number = 0
  public onFrame?: (timeDifference: number) => void

  private readonly frame = (time: number): void => {
    if (!this.running) return
    if (this.onFrame === undefined) throw new Error('Missing clock update function')

    const timeDifference = time - this.lastFrameTime
    this.lastFrameTime = time

    this.onFrame(timeDifference)
    requestAnimationFrame(this.frame)
  }

  public start (): void {
    this.running = true
    this.lastFrameTime = window.performance.now()
    requestAnimationFrame(this.frame)
  }

  public stop (): void {
    this.running = false
  }
}

export class TimerLogic {
  private readonly clock = new Clock()
  private duration: number = 0
  private remainingTime: number = 0
  private lastTickTime: number = 0

  public onElapsed?: (elapsedPercentage: number) => void
  public onTick?: (time: number) => void

  public constructor () {
    this.clock.onFrame = this.body
  }

  private readonly body = (timeDifference: number): void => {
    if (this.onElapsed === undefined) throw new Error('Missing onElapsed function')
    if (this.onTick === undefined) throw new Error('Missing onTick function')

    this.remainingTime = Math.max(this.remainingTime - timeDifference, 0)

    const elapsedPercentage = 1 - (this.remainingTime / this.duration)
    this.onElapsed(elapsedPercentage)

    if (this.remainingTime === 0) {
      this.clock.stop()
      this.onTick(0)
      return
    }

    if (this.lastTickTime - this.remainingTime > 1000) {
      this.lastTickTime = this.remainingTime

      const wholeTime = Math.ceil(this.remainingTime / 1000)
      this.onTick(wholeTime)
    }
  }

  public start (durationInSeconds: number): void {
    this.duration = this.remainingTime = this.lastTickTime = durationInSeconds * 1000
    this.clock.start()
  }

  public pause (): void {
    this.clock.stop()
  }

  public resume (): void {
    this.clock.start()
  }
}
