import { useEffect, useState, useRef } from 'react'
import { SSEClient } from '@upfluence/core'
import type { PostType } from '@upfluence/core'

export const useSSEStream = (url: string) => {
  const [isConnected, setIsConnected] = useState(false)
  const [lastPost, setLastPost] = useState<{
    type: PostType
    timestamp: number
  } | null>(null)
  const clientRef = useRef<SSEClient | null>(null)

  useEffect(() => {
    const client = new SSEClient(url, {
      onOpen: () => setIsConnected(true),
      onError: () => setIsConnected(false),
      onMessage: (type, timestamp) => {
        setLastPost({ type, timestamp })
      },
    })

    client.connect()
    clientRef.current = client

    return () => {
      client.disconnect()
    }
  }, [url])

  return { isConnected, lastPost }
}
