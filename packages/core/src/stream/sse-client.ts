import {
  SocialMedias,
  SocialMediasSchema,
  ContentSchema,
  type Timestamp,
} from '../validators/schemas'

export type SSEOptions = {
  onMessage?: (type: SocialMedias, timestamp: Timestamp) => void
  onError?: (error: Event) => void
  onOpen?: (event: Event) => void
}

export const createSSEClient = (url: string, options: SSEOptions = {}) => {
  let eventSource: EventSource | null = null

  const connect = () => {
    if (eventSource) {
      eventSource.close()
    }

    eventSource = new EventSource(url)

    eventSource.onopen = (event) => {
      options.onOpen?.(event)
    }

    eventSource.onerror = (error) => {
      options.onError?.(error)
    }

    eventSource.onmessage = (event) => {
      try {
        const json = JSON.parse(event.data)
        const keys = Object.keys(json)
        if (keys.length !== 1) return

        const socialMedia = keys[0]
        const content = json[socialMedia]

        const parsedSocialMedia = SocialMediasSchema.safeParse(socialMedia)
        const parsedContent = ContentSchema.safeParse(content)

        if (parsedSocialMedia.success && parsedContent.success) {
          options.onMessage?.(
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

  const disconnect = () => {
    if (eventSource) {
      eventSource.close()
      eventSource = null
    }
  }

  return { connect, disconnect }
}
