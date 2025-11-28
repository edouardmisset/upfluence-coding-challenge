import type { UseSSEStreamOutput } from '../hooks/use-sse-stream'

export function ConnectionStatus({
  isConnected,
}: Pick<UseSSEStreamOutput, 'isConnected'>) {
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
