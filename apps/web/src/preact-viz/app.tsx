/** @jsxImportSource preact */
import {
  Component,
  type ComponentChildren,
  type FunctionComponent,
} from 'preact'
import { ErrorFallback } from './components/error-fallback'
import { Dashboard } from './components/dashboard'

type ErrorBoundaryProps = {
  children: ComponentChildren
  FallbackComponent: FunctionComponent<{
    error: Error | null
    resetErrorBoundary: () => void
  }>
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught an error', error)
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      const { FallbackComponent } = this.props
      return (
        <FallbackComponent
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      )
    }

    return this.props.children
  }
}

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Dashboard />
    </ErrorBoundary>
  )
}
