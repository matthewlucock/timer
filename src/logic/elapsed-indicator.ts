const STROKE_WIDTH_TO_SIZE_RATIO = 1 / 12

export class ElapsedIndicator {
  public readonly element: HTMLCanvasElement = document.createElement('canvas')
  private readonly ctx = this.element.getContext('2d') as CanvasRenderingContext2D
  private size: number = 0

  public setSize (size: number): void {
    this.element.width = this.element.height = this.size = size
  }

  public clear (): void {
    this.ctx.clearRect(0, 0, this.size, this.size)
  }

  private draw (elapsedPercentage: number): void {
    const radius = this.size / 2
    const startingAngle = -0.5
    const strokeWidth = this.size * STROKE_WIDTH_TO_SIZE_RATIO

    const { ctx } = this
    ctx.save()
    ctx.beginPath()

    ctx.arc(
      radius,
      radius,
      radius - (strokeWidth / 2),
      startingAngle * Math.PI,
      ((1 - elapsedPercentage) * 2 + startingAngle) * Math.PI
    )

    ctx.lineWidth = strokeWidth
    ctx.lineCap = 'round'
    ctx.strokeStyle = 'white'
    ctx.stroke()

    ctx.restore()
  }

  public update (elapsedPercentage: number): void {
    this.clear()
    this.draw(elapsedPercentage)
  }
}
