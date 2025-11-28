import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { StreamService } from './stream-service'
import { REFRESH_RATE_MILLISECONDS } from '../constants'

// Mock EventSource globally since StreamService uses SSEClient which uses EventSource
const EventSourceMock = vi.fn(() => ({
  close: vi.fn(),
  onopen: null,
  onerror: null,
  onmessage: null,
}))

vi.stubGlobal('EventSource', EventSourceMock)

describe('StreamService', () => {
  let service: StreamService
  const url = 'http://test-stream.com'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    service = new StreamService(url)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with default state', () => {
    const listener = vi.fn()
    service.subscribe(listener)

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        isConnected: false,
        totalEvents: 0,
        eventsPerSecond: 0,
      }),
    )
  })

  it('should connect and handle connection status changes', () => {
    const listener = vi.fn()
    service.subscribe(listener)

    service.connect()

    // Get the underlying EventSource instance created by SSEClient
    const mockSource = EventSourceMock.mock.results[0].value

    // Simulate connection open
    const openEvent = new Event('open')
    mockSource.onopen(openEvent)

    expect(listener).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isConnected: true,
      }),
    )

    // Simulate connection error
    const errorEvent = new Event('error')
    mockSource.onerror(errorEvent)

    expect(listener).toHaveBeenLastCalledWith(
      expect.objectContaining({
        isConnected: false,
      }),
    )
  })

  it('should accumulate events and update state periodically', () => {
    const listener = vi.fn()
    service.subscribe(listener)
    service.connect()

    const mockSource = EventSourceMock.mock.results[0].value

    // Simulate receiving a message
    const timestamp = 1672531200
    const payload = JSON.stringify({
      instagram_media: { timestamp },
    })

    const event = { data: payload } as MessageEvent
    mockSource.onmessage(event)

    vi.advanceTimersByTime(REFRESH_RATE_MILLISECONDS)

    expect(listener).toHaveBeenLastCalledWith(
      expect.objectContaining({
        totalEvents: 1,
        totals: expect.objectContaining({
          instagram_media: 1,
        }),
      }),
    )
  })

  it('should disconnect and stop updates', () => {
    service.connect()
    const mockSource = EventSourceMock.mock.results[0].value

    service.disconnect()

    expect(mockSource.close).toHaveBeenCalled()

    // Verify loop stopped
    const listener = vi.fn()
    service.subscribe(listener)

    // Advance time, listener should only be called once (initial subscribe)
    vi.advanceTimersByTime(REFRESH_RATE_MILLISECONDS * 2)
    expect(listener).toHaveBeenCalledTimes(1)
  })
})
