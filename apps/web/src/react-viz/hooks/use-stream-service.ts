import { useEffect, useState, useRef } from 'react'
import { StreamService, type StreamState, STREAM_URL } from '@upfluence/core'

export const useStreamService = () => {
  const serviceRef = useRef<StreamService | null>(null)
  const [state, setState] = useState<StreamState>({
    isConnected: false,
    accumulator: {},
    totals: {},
    eventsPerSecond: 0,
    totalEvents: 0,
  } as StreamState)

  useEffect(() => {
    const service = new StreamService(STREAM_URL)
    serviceRef.current = service

    const unsubscribe = service.subscribe(setState)
    service.connect()

    return () => {
      unsubscribe()
      service.disconnect()
      serviceRef.current = null
    }
  }, [])

  return state
}
