import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 24,
            background: '#fff5f5',
            border: '1px solid #fed7d7',
            borderRadius: 8,
            color: '#c53030',
            margin: 24,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '8px 16px',
              background: '#c53030',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
