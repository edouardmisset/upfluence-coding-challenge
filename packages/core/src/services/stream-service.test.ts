import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createStreamService } from './stream-service'
import { REFRESH_RATE_MILLISECONDS } from '../constants'

const mockEventSource = {
  close: vi.fn(),
  onopen: null,
  onerror: null,
  onmessage: null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any

vi.stubGlobal(
  'EventSource',
  vi.fn(function () {
    return mockEventSource
  }),
)

describe('StreamService', () => {
  let service: ReturnType<typeof createStreamService>

  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    service = createStreamService('http://test.com')
    mockEventSource.onopen = null
    mockEventSource.onmessage = null
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should manage connection state', () => {
    const listener = vi.fn()
    service.subscribe(listener)

    service.connect()
    mockEventSource.onopen?.(new Event('open'))
    expect(listener).toHaveBeenLastCalledWith(
      expect.objectContaining({ isConnected: true }),
    )

    mockEventSource.onerror?.(new Event('error'))
    expect(listener).toHaveBeenLastCalledWith(
      expect.objectContaining({ isConnected: false }),
    )

    service.disconnect()
    expect(mockEventSource.close).toHaveBeenCalled()
  })

  it('should accumulate events', () => {
    const listener = vi.fn()
    service.subscribe(listener)
    service.connect()

    // Simulate message
    mockEventSource.onmessage?.({
      data: JSON.stringify({ instagram_media: { timestamp: 1_672_531_200 } }),
    })

    // Wait for update interval
    vi.advanceTimersByTime(REFRESH_RATE_MILLISECONDS)

    expect(listener).toHaveBeenLastCalledWith(
      expect.objectContaining({
        totalEvents: 1,
        totals: expect.objectContaining({ instagram_media: 1 }),
      }),
    )
  })
})
