import {
  SocialMedias,
  SocialMediasSchema,
  ContentSchema,
  type Timestamp,
} from '../validators/schemas'

export const streamUrl = 'https://stream.upfluence.co/stream'
export const refreshRateInMilliSeconds = 1_000

export type SSEOptions = {
  onMessage?: (type: SocialMedias, timestamp: Timestamp) => void
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
        const json = JSON.parse(event.data)
        const keys = Object.keys(json)
        if (keys.length !== 1) return

        const socialMedia = keys[0]
        const content = json[socialMedia]

        const parsedSocialMedia = SocialMediasSchema.safeParse(socialMedia)
        const parsedContent = ContentSchema.safeParse(content)

        if (parsedSocialMedia.success && parsedContent.success) {
          this.options.onMessage?.(
            parsedSocialMedia.data,
            parsedContent.data.timestamp,
          )
        } else {
          console.warn('Invalid payload:', json)
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
