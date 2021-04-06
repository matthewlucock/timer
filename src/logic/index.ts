import mitt from 'mitt'

class Clock {
  private running: boolean = false
  private lastFrameTime: number = 0
  public update?: (timeDifference: number) => void

  private readonly frame = (time: number): void => {
    if (!this.running) return
    if (this.update === undefined) throw new Error('Missing clock update function')

    const timeDifference = time - this.lastFrameTime
    this.lastFrameTime = time

    this.update(timeDifference)
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
  public readonly emitter = mitt()

  public constructor () {
    this.clock.update = this.body
  }

  private readonly body = (timeDifference: number): void => {
    this.remainingTime = Math.max(this.remainingTime - timeDifference, 0)

    const elapsedPercentage = 1 - (this.remainingTime / this.duration)
    this.emitter.emit('elapsed', elapsedPercentage)

    if (this.remainingTime === 0) {
      this.clock.stop()
      this.emitter.emit('tick', 0)
      return
    }

    if (this.lastTickTime - this.remainingTime > 1000) {
      this.lastTickTime = this.remainingTime

      const wholeTime = Math.ceil(this.remainingTime / 1000)
      this.emitter.emit('tick', wholeTime)
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
