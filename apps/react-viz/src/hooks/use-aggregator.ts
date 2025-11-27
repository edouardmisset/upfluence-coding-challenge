import { useEffect, useState, useRef } from 'react'
import { PostAggregator, refreshRateInMilliSeconds } from '@upfluence/core'
import type { Accumulator, Totals } from '@upfluence/core'
import type { SocialEvent } from './use-sse-stream'

export const useAggregator = (socialEvent: SocialEvent | undefined): UseAggregatorOutput => {
  const aggregatorRef = useRef(new PostAggregator())
  const [data, setData] = useState<Accumulator>({} as Accumulator)
  const [totals, setTotals] = useState<Totals>({} as Totals)

  useEffect(() => {
    if (socialEvent) {
      const { socialMedia, timestamp } = socialEvent
      aggregatorRef.current.increment(socialMedia, timestamp)
    }
  }, [socialEvent])

  useEffect(() => {
    // Update data and totals at a given refresh rate
    const interval = setInterval(() => {
      setData({ ...aggregatorRef.current.getData() })
      setTotals({ ...aggregatorRef.current.getAllTotals() })
    }, refreshRateInMilliSeconds)

    return () => clearInterval(interval)
  }, [])

  return { data, totals }
}

type UseAggregatorOutput = {
  data: Accumulator
  totals: Totals
}
