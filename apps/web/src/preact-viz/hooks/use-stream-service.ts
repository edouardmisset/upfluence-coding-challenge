import { useEffect, useState, useRef } from 'preact/hooks'
import {
  createStreamService,
  type StreamService,
  type StreamState,
  STREAM_URL,
} from '@upfluence/core'

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
    const service = createStreamService(STREAM_URL)
    serviceRef.current = service

    const handleUpdate = (newState: StreamState) => {
      if (!document.startViewTransition) {
        setState(newState)
        return
      }

      document.startViewTransition(() => {
        setState(newState)
      })
    }

    const unsubscribe = service.subscribe(handleUpdate)
    service.connect()

    return () => {
      unsubscribe()
      service.disconnect()
      serviceRef.current = null
    }
  }, [])

  return state
}
