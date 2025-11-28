import { useSSEStream } from '../hooks/use-sse-stream'
import { useAccumulator } from '../hooks/use-accumulator'
import { usePerformanceMetrics } from '../hooks/use-performance-metrics'
import { SocialEventCard } from './social-event-card'
import { ConnectionStatus } from './connection-status'
import { SOCIAL_MEDIAS, streamUrl } from '@upfluence/core'

export function Dashboard() {
  const { isConnected, lastSocialEvent } = useSSEStream(streamUrl)
  const { accumulator, totals } = useAccumulator(lastSocialEvent)

  const totalEvents = Object.values(totals).reduce((a, b) => a + b, 0)
  const { eventsPerSecond } = usePerformanceMetrics(totalEvents)

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Upfluence Live Stream</h1>
          <p className="dashboard-subtitle">
            Real-time social media events visualization
          </p>
        </div>

        <div className="dashboard-status-container">
          <div className="dashboard-metrics">
            <div className="dashboard-rate">{eventsPerSecond} events/sec</div>
            <div>{totalEvents.toLocaleString()} total</div>
          </div>
          <ConnectionStatus isConnected={isConnected} />
        </div>
      </header>

      <div className="dashboard-grid">
        {SOCIAL_MEDIAS.map((type) => (
          <SocialEventCard
            key={type}
            socialMedia={type}
            count={totals[type] || 0}
            weekdayHourlyCount={accumulator[type] || {}}
          />
        ))}
      </div>
    </div>
  )
}
