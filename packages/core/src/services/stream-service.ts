import { REFRESH_RATE_MILLISECONDS } from '../constants'
import {
  createEventAccumulator,
  type Accumulator,
  type Totals,
} from '../accumulator/event-accumulator'
import { createPerformanceTracker } from '../utils/performance-tracker'
import { SocialMedias, type Timestamp } from '../validators/schemas'
import { createSSEClient } from '../stream/sse-client'

export type StreamState = {
  isConnected: boolean
  accumulator: Accumulator
  totals: Totals
  eventsPerSecond: number
  totalEvents: number
}

export type StreamServiceListener = (state: StreamState) => void

export const createStreamService = (url: string) => {
  const accumulator = createEventAccumulator()
  const performanceTracker = createPerformanceTracker()
  const listeners = new Set<StreamServiceListener>()

  let state: StreamState = {
    isConnected: false,
    accumulator: accumulator.getData(),
    totals: accumulator.getAllTotals(),
    eventsPerSecond: 0,
    totalEvents: 0,
  }

  let updateInterval: ReturnType<typeof setInterval> | null = null

  const notifyListeners = () => {
    listeners.forEach((listener) => listener(state))
  }

  const handleConnectionChange = (isConnected: boolean) => {
    state = { ...state, isConnected }
    notifyListeners()
  }

  const handleMessage = (type: SocialMedias, timestamp: Timestamp) => {
    accumulator.increment(type, timestamp)
  }

  const updateState = () => {
    const totals = accumulator.getAllTotals()
    const totalEvents = Object.values(totals).reduce((a, b) => a + b, 0)

    performanceTracker.update(totalEvents)

    state = {
      ...state,
      accumulator: { ...accumulator.getData() },
      totals: { ...totals },
      eventsPerSecond: performanceTracker.getRate(),
      totalEvents,
    }

    notifyListeners()
  }

  const startUpdateLoop = () => {
    if (updateInterval) return

    updateInterval = setInterval(() => {
      updateState()
    }, REFRESH_RATE_MILLISECONDS)
  }

  const stopUpdateLoop = () => {
    if (updateInterval) {
      clearInterval(updateInterval)
      updateInterval = null
    }
  }

  const client = createSSEClient(url, {
    onOpen: () => handleConnectionChange(true),
    onError: () => handleConnectionChange(false),
    onMessage: handleMessage,
  })

  const connect = () => {
    client.connect()
    startUpdateLoop()
  }

  const disconnect = () => {
    client.disconnect()
    stopUpdateLoop()
    handleConnectionChange(false)
  }

  const subscribe = (listener: StreamServiceListener): (() => void) => {
    listeners.add(listener)
    listener(state) // Immediate update
    return () => {
      listeners.delete(listener)
    }
  }

  return {
    connect,
    disconnect,
    subscribe,
  }
}

export type StreamService = ReturnType<typeof createStreamService>
