<script setup lang="ts">
import WeeklyCalendarGraph from './weekly-calendar-graph.vue'
import {
  SOCIAL_MEDIA_TEXT_MAP,
  type SocialMedias,
  type WeekdayHourlyCount,
} from '@upfluence/core'

defineProps<{
  socialMedia: SocialMedias
  count: number
  weekdayHourlyCount: WeekdayHourlyCount
}>()
</script>

<template>
  <article class="social-event-card" :data-social="socialMedia">
    <header class="social-event-header">
      <h2 class="social-event-title">
        {{ SOCIAL_MEDIA_TEXT_MAP[socialMedia] }}
      </h2>
      <data class="social-event-count" :value="count">
        {{ count }}
      </data>
    </header>
    <WeeklyCalendarGraph :weekdayHourlyCount="weekdayHourlyCount" />
  </article>
</template>
