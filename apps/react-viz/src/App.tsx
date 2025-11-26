import { ErrorFallback } from './components/error-fallback'
import { Dashboard } from './components/dashboard'
import { ErrorBoundary } from 'react-error-boundary'

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Dashboard />
    </ErrorBoundary>
  )
}

export default App
