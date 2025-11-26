import { roundToPrecision } from '@edouardmisset/math'
import { refreshRateInMilliSeconds } from '@upfluence/core'
import { useEffect, useRef, useState } from 'react'

export const usePerformanceMetrics = (totalPosts: number) => {
  const [rate, setRate] = useState(0)
  const totalPostsRef = useRef(totalPosts)
  const previousTotalRef = useRef(totalPosts)
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    totalPostsRef.current = totalPosts
  }, [totalPosts])

  useEffect(() => {
    lastTimeRef.current = Date.now()

    const interval = setInterval(() => {
      const now = Date.now()
      const timeDiff = (now - lastTimeRef.current) / refreshRateInMilliSeconds
      const currentTotal = totalPostsRef.current
      const countDiff = currentTotal - previousTotalRef.current

      if (timeDiff > 0) {
        setRate(roundToPrecision(countDiff / timeDiff, 1))
      }

      previousTotalRef.current = currentTotal
      lastTimeRef.current = now
    }, 2 * refreshRateInMilliSeconds)

    return () => clearInterval(interval)
  }, [])

  return { postsPerSecond: rate }
}
