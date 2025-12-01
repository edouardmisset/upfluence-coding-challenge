import { useStreamService } from '../hooks/use-stream-service'
import { SocialEventCard } from './social-event-card'
import { ConnectionStatus } from './connection-status'

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
        <div className="dashboard-header-left">
          <a
            href="/upfluence-coding-challenge"
            aria-label="Back to home"
            className="dashboard-back-link"
          >
            ⬅️
          </a>
          <div>
            <h1 className="dashboard-title">Upfluence Live Stream - React</h1>
            <p className="dashboard-subtitle">
              Real-time social media events visualization
            </p>
          </div>
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
        {Object.keys(totals).map((socialMedia) => {
          const socialMediaKey = socialMedia as keyof typeof totals
          return (
            <SocialEventCard
              key={socialMedia}
              socialMedia={socialMediaKey}
              count={totals[socialMediaKey] ?? 0}
              weekdayHourlyCount={accumulator[socialMediaKey] ?? {}}
              data-view-transition-name={socialMediaKey}
            />
          )
        })}
      </div>
    </main>
  )
}
