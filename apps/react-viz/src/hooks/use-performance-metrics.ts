import { useState, useEffect, useRef } from 'react'

export const usePerformanceMetrics = (totalPosts: number) => {
  const [rate, setRate] = useState(0)
  const totalPostsRef = useRef(totalPosts)
  const prevTotalRef = useRef(totalPosts)
  const lastTimeRef = useRef<number>(0)

  // Keep ref in sync
  useEffect(() => {
    totalPostsRef.current = totalPosts
  }, [totalPosts])

  useEffect(() => {
    lastTimeRef.current = Date.now()

    const interval = setInterval(() => {
      const now = Date.now()
      const timeDiff = (now - lastTimeRef.current) / 1000 // seconds
      const currentTotal = totalPostsRef.current
      const countDiff = currentTotal - prevTotalRef.current

      if (timeDiff > 0) {
        setRate(Math.round((countDiff / timeDiff) * 10) / 10) // 1 decimal place
      }

      prevTotalRef.current = currentTotal
      lastTimeRef.current = now
    }, 2000) // Update every 2 seconds for stability

    return () => clearInterval(interval)
  }, [])

  return { postsPerSecond: rate }
}
