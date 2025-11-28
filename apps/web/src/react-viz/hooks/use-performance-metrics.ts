import { roundToPrecision } from '@edouardmisset/math'
import { refreshRateInMilliSeconds } from '@upfluence/core'
import { useEffect, useRef, useState } from 'react'

export const usePerformanceMetrics = (
  totalEvents: number,
): { eventsPerSecond: number } => {
  const [rate, setRate] = useState(0)
  const totalEventsRef = useRef(totalEvents)
  const previousTotalRef = useRef(totalEvents)
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    totalEventsRef.current = totalEvents
  }, [totalEvents])

  useEffect(() => {
    lastTimeRef.current = Date.now()

    const interval = setInterval(() => {
      const now = Date.now()
      const timeDiff = (now - lastTimeRef.current) / refreshRateInMilliSeconds
      const currentTotal = totalEventsRef.current
      const countDiff = currentTotal - previousTotalRef.current

      if (timeDiff > 0) {
        setRate(roundToPrecision(countDiff / timeDiff, 1))
      }

      previousTotalRef.current = currentTotal
      lastTimeRef.current = now
    }, 2 * refreshRateInMilliSeconds)

    return () => clearInterval(interval)
  }, [])

  return { eventsPerSecond: rate }
}
