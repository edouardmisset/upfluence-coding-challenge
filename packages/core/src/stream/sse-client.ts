import { PostType, PostTypeSchema, PostSchema } from '../validators/schemas'

export type SSEOptions = {
  onMessage?: (type: PostType, timestamp: number) => void
  onError?: (error: Event) => void
  onOpen?: (event: Event) => void
}

export class SSEClient {
  private eventSource: EventSource | null = null
  private url: string
  private options: SSEOptions

  constructor(url: string, options: SSEOptions = {}) {
    this.url = url
    this.options = options
  }

  connect() {
    if (this.eventSource) {
      this.eventSource.close()
    }

    this.eventSource = new EventSource(this.url)

    this.eventSource.onopen = (event) => {
      this.options.onOpen?.(event)
    }

    this.eventSource.onerror = (error) => {
      this.options.onError?.(error)
    }

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        const keys = Object.keys(data)
        if (keys.length !== 1) return

        const eventType = keys[0]
        const eventPayload = data[eventType]

        // Validate
        const parsedEventType = PostTypeSchema.safeParse(eventType)
        const parsedPayload = PostSchema.safeParse(eventPayload)

        if (parsedEventType.success && parsedPayload.success) {
          this.options.onMessage?.(
            parsedEventType.data,
            parsedPayload.data.timestamp,
          )
        } else {
          console.warn('Invalid payload:', data)
        }
      } catch (e) {
        console.error('Failed to parse SSE message', e)
      }
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
  }
}
