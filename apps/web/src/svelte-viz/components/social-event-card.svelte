<script lang="ts">
  import WeeklyCalendarGraph from './weekly-calendar-graph.svelte'
  import {
    SOCIAL_MEDIA_TEXT_MAP,
    type SocialMedias,
    type WeekdayHourlyCount,
  } from '@upfluence/core'

  let {
    socialMedia,
    count,
    weekdayHourlyCount,
  }: {
    socialMedia: SocialMedias
    count: number
    weekdayHourlyCount: WeekdayHourlyCount
  } = $props()
</script>

<article class="social-event-card" data-social={socialMedia}>
  <header class="social-event-header">
    <h3 class="social-event-title">
      {SOCIAL_MEDIA_TEXT_MAP[socialMedia]}
    </h3>
    <data class="social-event-count" value={count}>
      {count}
    </data>
  </header>
  <WeeklyCalendarGraph {weekdayHourlyCount} />
</article>
