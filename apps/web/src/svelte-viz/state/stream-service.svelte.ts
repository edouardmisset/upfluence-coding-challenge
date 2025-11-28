import {
  createStreamService,
  type StreamService,
  type StreamState,
  STREAM_URL,
} from '@upfluence/core'

export function createStreamState() {
  let service: StreamService | null = null
  let state = $state<StreamState>({
    isConnected: false,
    accumulator: {},
    totals: {},
    eventsPerSecond: 0,
    totalEvents: 0,
  } as StreamState)

  function connect() {
    service = createStreamService(STREAM_URL)
    const unsubscribe = service.subscribe((newState) => {
      state = newState
    })
    service.connect()

    return () => {
      unsubscribe()
      service?.disconnect()
      service = null
    }
  }

  return {
    get value() {
      return state
    },
    connect,
  }
}
