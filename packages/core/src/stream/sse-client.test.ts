import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createSSEClient } from './sse-client'

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

describe('SSEClient', () => {
  const url = 'http://test-stream.com'
  const handlers = {
    onMessage: vi.fn(),
    onError: vi.fn(),
    onOpen: vi.fn(),
  }
  let client: ReturnType<typeof createSSEClient>

  beforeEach(() => {
    vi.clearAllMocks()
    client = createSSEClient(url, handlers)
    // Reset event handlers on the mock
    mockEventSource.onopen = null
    mockEventSource.onerror = null
    mockEventSource.onmessage = null
  })

  it('should connect and handle events', () => {
    client.connect()
    expect(EventSource).toHaveBeenCalledWith(url)

    // Test Open
    mockEventSource.onopen?.(new Event('open'))
    expect(handlers.onOpen).toHaveBeenCalled()

    // Test Message
    const timestamp = 1672531200
    mockEventSource.onmessage?.({
      data: JSON.stringify({ instagram_media: { timestamp } }),
    })
    expect(handlers.onMessage).toHaveBeenCalledWith(
      'instagram_media',
      timestamp,
    )

    // Test Error
    mockEventSource.onerror?.(new Event('error'))
    expect(handlers.onError).toHaveBeenCalled()
  })

  it('should ignore invalid messages', () => {
    client.connect()
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // Invalid JSON
    mockEventSource.onmessage?.({ data: 'invalid' })
    expect(handlers.onMessage).not.toHaveBeenCalled()

    // Invalid Schema
    mockEventSource.onmessage?.({
      data: JSON.stringify({ unknown_type: { timestamp: 123 } }),
    })
    expect(handlers.onMessage).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
    warnSpy.mockRestore()
  })

  it('should disconnect', () => {
    client.connect()
    client.disconnect()
    expect(mockEventSource.close).toHaveBeenCalled()
  })
})
