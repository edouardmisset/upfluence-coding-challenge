import type { useStreamService } from '../hooks/use-stream-service'

export function ConnectionStatus({
  isConnected,
}: Pick<ReturnType<typeof useStreamService>, 'isConnected'>) {
  return (
    <div
      className="connection-status"
      data-connected={isConnected}
      role="status"
      aria-live="polite"
    >
      <span className="connection-status-indicator" />
      {isConnected ? 'Live Stream' : 'Connecting...'}
    </div>
  )
}
