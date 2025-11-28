<script lang="ts">
  import {
    DAYS,
    HOURS,
    type WeekdayHourlyCount,
    calculateIntensity,
    calculateMaxHourlyCount,
  } from '@upfluence/core'

  let { weekdayHourlyCount }: { weekdayHourlyCount: WeekdayHourlyCount } =
    $props()

  let maxCount = $derived(calculateMaxHourlyCount(weekdayHourlyCount))

  function getIntensity(count: number, max: number) {
    return calculateIntensity({ count, maxCount: max })
  }

  function getCount(dayIndex: number, hour: number) {
    return weekdayHourlyCount[dayIndex]?.[hour] ?? 0
  }
</script>

<div
  class="weekly-calendar-graph"
  role="img"
  aria-label="Weekly calendar graph of events by day and hour"
>
  <!-- Header -->
  <div></div>
  {#each HOURS as hour}
    <time datetime={`${hour}:00`} class="weekly-calendar-graph-label">
      {hour}
    </time>
  {/each}

  <!-- Rows -->
  {#each DAYS as dayName, dayIndex}
    <time class="weekly-calendar-graph-label">{dayName}</time>
    {#each HOURS as hour}
      {@const count = getCount(dayIndex, hour)}
      <i
        class={`weekly-calendar-graph-cell intensity-${getIntensity(
          count,
          maxCount
        )}`}
        title={`${dayName} ${hour}:00-${hour}:59 - ${count} events`}
      ></i>
    {/each}
  {/each}
</div>
