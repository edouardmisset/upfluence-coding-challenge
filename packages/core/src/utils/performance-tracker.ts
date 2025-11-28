import { roundToPrecision } from '@edouardmisset/math'

export class PerformanceTracker {
  private lastTime: number = 0
  private previousTotal: number = 0
  private rate: number = 0

  constructor() {
    this.reset()
  }

  reset() {
    this.lastTime = Date.now()
    this.previousTotal = 0
    this.rate = 0
  }

  update(currentTotal: number) {
    const now = Date.now()

    const timeDifferenceInSeconds = (now - this.lastTime) / 1000

    if (timeDifferenceInSeconds > 0) {
      const countDiff = currentTotal - this.previousTotal
      this.rate = roundToPrecision(countDiff / timeDifferenceInSeconds, 1)
    }

    this.previousTotal = currentTotal
    this.lastTime = now
  }

  getRate(): number {
    return this.rate
  }
}
