import { REFRESH_RATE_MILLISECONDS } from '../constants'
import {
  EventAccumulator,
  type Accumulator,
  type Totals,
} from '../accumulator/event-accumulator'
import { PerformanceTracker } from '../utils/performance-tracker'
import { SocialMedias, type Timestamp } from '../validators/schemas'
import { SSEClient } from '../stream/sse-client'

export type StreamState = {
  isConnected: boolean
  accumulator: Accumulator
  totals: Totals
  eventsPerSecond: number
  totalEvents: number
}

export type StreamServiceListener = (state: StreamState) => void

export class StreamService {
  private client: SSEClient
  private accumulator: EventAccumulator
  private performanceTracker: PerformanceTracker
  private listeners: Set<StreamServiceListener> = new Set()
  private state: StreamState
  private updateInterval: ReturnType<typeof setInterval> | null = null

  constructor(url: string) {
    this.accumulator = new EventAccumulator()
    this.performanceTracker = new PerformanceTracker()

    this.state = {
      isConnected: false,
      accumulator: this.accumulator.getData(),
      totals: this.accumulator.getAllTotals(),
      eventsPerSecond: 0,
      totalEvents: 0,
    }

    this.client = new SSEClient(url, {
      onOpen: () => this.handleConnectionChange(true),
      onError: () => this.handleConnectionChange(false),
      onMessage: (type, timestamp) => this.handleMessage(type, timestamp),
    })
  }

  connect() {
    this.client.connect()
    this.startUpdateLoop()
  }

  disconnect() {
    this.client.disconnect()
    this.stopUpdateLoop()
    this.handleConnectionChange(false)
  }

  subscribe(listener: StreamServiceListener): () => void {
    this.listeners.add(listener)
    listener(this.state) // Immediate update
    return () => {
      this.listeners.delete(listener)
    }
  }

  private handleConnectionChange(isConnected: boolean) {
    this.state = { ...this.state, isConnected }
    this.notifyListeners()
  }

  private handleMessage(type: SocialMedias, timestamp: Timestamp) {
    this.accumulator.increment(type, timestamp)
  }

  private startUpdateLoop() {
    if (this.updateInterval) return

    this.updateInterval = setInterval(() => {
      this.updateState()
    }, REFRESH_RATE_MILLISECONDS)
  }

  private stopUpdateLoop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  private updateState() {
    const totals = this.accumulator.getAllTotals()
    const totalEvents = Object.values(totals).reduce((a, b) => a + b, 0)

    this.performanceTracker.update(totalEvents)

    this.state = {
      ...this.state,
      accumulator: { ...this.accumulator.getData() },
      totals: { ...totals },
      eventsPerSecond: this.performanceTracker.getRate(),
      totalEvents,
    }

    this.notifyListeners()
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.state))
  }
}
