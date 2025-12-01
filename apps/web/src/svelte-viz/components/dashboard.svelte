<script lang="ts">
  import { createStreamState } from '../state/stream-service.svelte'
  import SocialEventCard from './social-event-card.svelte'
  import ConnectionStatus from './connection-status.svelte'
  import { SOCIAL_MEDIAS } from '@upfluence/core'

  const streamState = createStreamState()

  $effect(() => {
    const cleanup = streamState.connect()
    return cleanup
  })
</script>

<main class="dashboard-container">
  <header class="dashboard-header">
    <div class="dashboard-header-left">
      <a
        href="/upfluence-coding-challenge"
        aria-label="Back to home"
        class="dashboard-back-link"
      >
        ⬅️
      </a>
      <div>
        <h1 class="dashboard-title">Upfluence Live Stream - Svelte</h1>
        <p class="dashboard-subtitle">
          Real-time social media events visualization
        </p>
      </div>
    </div>

    <div class="dashboard-status-container">
      <div class="dashboard-metrics">
        <div class="dashboard-rate">
          {streamState.value.eventsPerSecond} events/sec
        </div>
        <div>{streamState.value.totalEvents.toLocaleString()} total</div>
      </div>
      <ConnectionStatus isConnected={streamState.value.isConnected} />
    </div>
  </header>

  <div class="dashboard-grid">
    {#each SOCIAL_MEDIAS as socialMedia (socialMedia)}
      <SocialEventCard
        {socialMedia}
        count={streamState.value.totals[socialMedia] ?? 0}
        weekdayHourlyCount={streamState.value.accumulator[socialMedia] ?? {}}
      />
    {/each}
  </div>
</main>
