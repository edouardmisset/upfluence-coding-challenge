<script setup lang="ts">
import { computed } from 'vue'
import {
  DAYS,
  HOURS,
  type WeekdayHourlyCount,
  calculateIntensity,
  calculateMaxHourlyCount,
} from '@upfluence/core'

const props = defineProps<{
  weekdayHourlyCount: WeekdayHourlyCount
}>()

const maxCount = computed(() =>
  calculateMaxHourlyCount(props.weekdayHourlyCount),
)

const getIntensity = (count: number, max: number) => {
  return calculateIntensity({ count, maxCount: max })
}

const getCount = (dayIndex: number, hour: number) => {
  return props.weekdayHourlyCount[dayIndex]?.[hour] ?? 0
}
</script>

<template>
  <div
    class="weekly-calendar-graph"
    role="img"
    aria-label="Weekly calendar graph of events by day and hour"
  >
    <!-- Header -->
    <div />
    <time
      v-for="hour in HOURS"
      :key="hour"
      :datetime="`${hour}:00`"
      class="weekly-calendar-graph-label"
    >
      {{ hour }}
    </time>

    <!-- Rows -->
    <template v-for="(dayName, dayIndex) in DAYS" :key="dayName">
      <time class="weekly-calendar-graph-label">{{ dayName }}</time>
      <i
        v-for="hour in HOURS"
        :key="hour"
        :class="`weekly-calendar-graph-cell intensity-${getIntensity(
          getCount(dayIndex, hour),
          maxCount,
        )}`"
        :title="`${dayName} ${hour}:00-${hour}:59 - ${getCount(
          dayIndex,
          hour,
        )} events`"
      />
    </template>
  </div>
</template>
