import { useEffect, useState, useRef } from 'react'
import { PostAggregator } from '@upfluence/core'
import type { PostType, AggregatedData } from '@upfluence/core'

export const useAggregator = (
  lastPost: { type: PostType; timestamp: number } | null,
) => {
  const aggregatorRef = useRef(new PostAggregator())
  const [data, setData] = useState<AggregatedData>({})
  const [totals, setTotals] = useState<Record<string, number>>({})

  useEffect(() => {
    if (lastPost) {
      aggregatorRef.current.increment(lastPost.type, lastPost.timestamp)
    }
  }, [lastPost])

  useEffect(() => {
    const interval = setInterval(() => {
      // Create a new object reference to trigger re-renders
      // We might need deeper cloning if components are heavily memoized,
      // but for now top-level shallow copy is enough to signal "something changed"
      setData({ ...aggregatorRef.current.getData() })
      setTotals({ ...aggregatorRef.current.getAllTotals() })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return { data, totals }
}
