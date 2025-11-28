<script lang="ts">
  import { onMount } from 'svelte'
  import { createStreamState } from '../state/stream-service.svelte'
  import SocialEventCard from './SocialEventCard.svelte'
  import ConnectionStatus from './ConnectionStatus.svelte'
  import { SOCIAL_MEDIAS } from '@upfluence/core'

  const streamState = createStreamState()

  onMount(() => {
    const cleanup = streamState.connect()
    return cleanup
  })
</script>

<main class="dashboard-container">
  <header class="dashboard-header">
    <div>
      <h1 class="dashboard-title">Upfluence Live Stream</h1>
      <p class="dashboard-subtitle">
        Real-time social media events visualization
      </p>
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
