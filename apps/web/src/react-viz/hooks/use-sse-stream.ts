import { useEffect, useState, useRef } from 'react'
import { SSEClient } from '@upfluence/core'
import type { SocialMedias } from '@upfluence/core'

export const useSSEStream = (url: string): UseSSEStreamOutput => {
  const [isConnected, setIsConnected] = useState(false)
  const [lastSocialEvent, setLastSocialEvent] = useState<
    SocialEvent | undefined
  >(undefined)
  const clientRef = useRef<SSEClient | null>(null)

  useEffect(() => {
    const client = new SSEClient(url, {
      onOpen: () => setIsConnected(true),
      onError: () => setIsConnected(false),
      onMessage: (socialMedia, timestamp) => {
        setLastSocialEvent({ socialMedia, timestamp })
      },
    })

    client.connect()
    clientRef.current = client

    return () => {
      client.disconnect()
      clientRef.current = null
      setIsConnected(false)
    }
  }, [url])

  return { isConnected, lastSocialEvent }
}

export type SocialEvent = {
  socialMedia: SocialMedias
  timestamp: number
}

export type UseSSEStreamOutput = {
  isConnected: boolean
  lastSocialEvent: SocialEvent | undefined
}
