import React from 'react'

type Props = {
  isConnected: boolean
}

export const ConnectionStatus: React.FC<Props> = ({ isConnected }) => {
  return (
    <div
      style={{
        padding: '6px 12px',
        borderRadius: 20,
        background: isConnected ? '#e6fffa' : '#fff5f5',
        color: isConnected ? '#2c7a7b' : '#c53030',
        border: `1px solid ${isConnected ? '#b2f5ea' : '#fed7d7'}`,
        fontWeight: 500,
        fontSize: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'all 0.3s ease',
      }}
      role="status"
      aria-live="polite"
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'currentColor',
          display: 'inline-block',
          boxShadow: isConnected ? '0 0 0 2px rgba(44, 122, 123, 0.2)' : 'none',
        }}
      />
      {isConnected ? 'Live Stream' : 'Connecting...'}
    </div>
  )
}
