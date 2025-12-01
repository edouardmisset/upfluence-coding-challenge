<script setup lang="ts">
import { useStreamService } from '../composables/use-stream-service'
import SocialEventCard from './social-event-card.vue'
import ConnectionStatus from './connection-status.vue'
import { SOCIAL_MEDIAS } from '@upfluence/core'

const state = useStreamService()
</script>

<template>
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
          <h1 class="dashboard-title">Upfluence Live Stream - Vue</h1>
          <p class="dashboard-subtitle">
            Real-time social media events visualization
          </p>
        </div>
      </div>

      <div class="dashboard-status-container">
        <div class="dashboard-metrics">
          <div class="dashboard-rate">
            {{ state.eventsPerSecond }} events/sec
          </div>
          <div>{{ state.totalEvents.toLocaleString() }} total</div>
        </div>
        <ConnectionStatus :isConnected="state.isConnected" />
      </div>
    </header>

    <div class="dashboard-grid">
      <SocialEventCard
        v-for="socialMedia in SOCIAL_MEDIAS"
        :key="socialMedia"
        :socialMedia="socialMedia"
        :count="state.totals[socialMedia] ?? 0"
        :weekdayHourlyCount="state.accumulator[socialMedia] ?? {}"
      />
    </div>
  </main>
</template>
