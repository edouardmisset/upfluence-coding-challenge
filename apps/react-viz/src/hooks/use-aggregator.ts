import { useEffect, useState, useRef } from 'react'
import { PostAggregator, refreshRateInMilliSeconds } from '@upfluence/core'
import type { PostType, Accumulator, Timestamp, Totals } from '@upfluence/core'

export const useAggregator = (lastPost: PostEvent): UseAggregatorOutput => {
  const aggregatorRef = useRef(new PostAggregator())
  const [data, setData] = useState<Accumulator>({} as Accumulator)
  const [totals, setTotals] = useState<Totals>({} as Totals)

  useEffect(() => {
    if (lastPost) {
      aggregatorRef.current.increment(lastPost.type, lastPost.timestamp)
    }
  }, [lastPost])

  useEffect(() => {
    // Update data and totals at a regular interval (refresh rate)
    const interval = setInterval(() => {
      setData({ ...aggregatorRef.current.getData() })
      setTotals({ ...aggregatorRef.current.getAllTotals() })
    }, refreshRateInMilliSeconds)

    return () => clearInterval(interval)
  }, [])

  return { data, totals }
}

type PostEvent =
  | {
      type: PostType
      timestamp: Timestamp
    }
  | undefined

type UseAggregatorOutput = {
  data: Accumulator
  totals: Totals
}
