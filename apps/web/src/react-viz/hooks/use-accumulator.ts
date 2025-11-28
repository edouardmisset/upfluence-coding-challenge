import { useEffect, useState, useRef } from 'react'
import { EventAccumulator, refreshRateInMilliSeconds } from '@upfluence/core'
import type { Accumulator, Totals } from '@upfluence/core'
import type { SocialEvent } from './use-sse-stream'

export const useAccumulator = (
  socialEvent: SocialEvent | undefined,
): UseAccumulatorOutput => {
  const aggregatorRef = useRef(new EventAccumulator())
  const [accumulator, setAccumulator] = useState<Accumulator>({} as Accumulator)
  const [totals, setTotals] = useState<Totals>({} as Totals)

  useEffect(() => {
    if (socialEvent) {
      const { socialMedia, timestamp } = socialEvent
      aggregatorRef.current.increment(socialMedia, timestamp)
    }
  }, [socialEvent])

  useEffect(() => {
    // Update accumulator and totals at a given refresh rate
    const interval = setInterval(() => {
      setAccumulator({ ...aggregatorRef.current.getData() })
      setTotals({ ...aggregatorRef.current.getAllTotals() })
    }, refreshRateInMilliSeconds)

    return () => clearInterval(interval)
  }, [])

  return { accumulator, totals }
}

type UseAccumulatorOutput = {
  accumulator: Accumulator
  totals: Totals
}
