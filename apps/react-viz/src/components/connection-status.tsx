import React from 'react'

type Props = {
  isConnected: boolean
}

export const ConnectionStatus: React.FC<Props> = ({ isConnected }) => {
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
