import { useSSEStream } from './hooks/use-sse-stream'
import { useAggregator } from './hooks/use-aggregator'
import { usePerformanceMetrics } from './hooks/use-performance-metrics'
import { PostTypeCard } from './components/post-type-card'
import { ConnectionStatus } from './components/connection-status'
import { ErrorBoundary } from 'react-error-boundary'
import { SOCIAL_MEDIAS } from '@upfluence/core'
import './app.css'

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error
  resetErrorBoundary: () => void
}) {
  return (
    <div className="error-fallback">
      <h2>Something went wrong.</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function Dashboard() {
  const { isConnected, lastPost } = useSSEStream(
    'https://stream.upfluence.co/stream',
  )
  const { data, totals } = useAggregator(lastPost)

  const totalPosts = Object.values(totals).reduce((a, b) => a + b, 0)
  const { postsPerSecond } = usePerformanceMetrics(totalPosts)

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Upfluence Live Stream</h1>
          <p className="dashboard-subtitle">
            Real-time social media post visualization
          </p>
        </div>

        <div className="dashboard-status-container">
          <div className="dashboard-metrics">
            <div className="dashboard-rate">{postsPerSecond} posts/sec</div>
            <div>{totalPosts.toLocaleString()} total</div>
          </div>
          <ConnectionStatus isConnected={isConnected} />
        </div>
      </header>

      <div className="dashboard-grid">
        {SOCIAL_MEDIAS.map((type) => (
          <PostTypeCard
            key={type}
            type={type}
            count={totals[type] || 0}
            data={data[type] || {}}
          />
        ))}
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Dashboard />
    </ErrorBoundary>
  )
}

export default App
