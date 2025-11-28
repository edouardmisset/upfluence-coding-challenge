import { useStreamService } from '../hooks/use-stream-service'
import { SocialEventCard } from './social-event-card'
import { ConnectionStatus } from './connection-status'
import { SOCIAL_MEDIAS } from '@upfluence/core'

export function Dashboard() {
  const {
    isConnected,
    accumulator,
    totals,
    eventsPerSecond,
    totalEvents = 0,
  } = useStreamService()

  return (
    <main className="dashboard-container">
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
        {SOCIAL_MEDIAS.map((socialMedia) => (
          <SocialEventCard
            key={socialMedia}
            socialMedia={socialMedia}
            count={totals[socialMedia] ?? 0}
            weekdayHourlyCount={accumulator[socialMedia] ?? {}}
          />
        ))}
      </div>
    </main>
  )
}
