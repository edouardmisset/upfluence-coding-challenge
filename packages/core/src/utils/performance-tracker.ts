import { roundToPrecision } from '@edouardmisset/math'

export const createPerformanceTracker = () => {
  let lastTime = 0
  let previousTotal = 0
  let rate = 0

  const reset = () => {
    lastTime = Date.now()
    previousTotal = 0
    rate = 0
  }

  const update = (currentTotal: number) => {
    const now = Date.now()

    const timeDifferenceInSeconds = (now - lastTime) / 1000

    if (timeDifferenceInSeconds > 0) {
      const countDiff = currentTotal - previousTotal
      rate = roundToPrecision(countDiff / timeDifferenceInSeconds, 1)
    }

    previousTotal = currentTotal
    lastTime = now
  }

  const getRate = (): number => rate

  // Initialize
  reset()

  return {
    reset,
    update,
    getRate,
  }
}
