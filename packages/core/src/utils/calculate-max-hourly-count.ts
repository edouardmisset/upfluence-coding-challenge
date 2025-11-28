import type { WeekdayHourlyCount } from "../accumulator/event-accumulator"

export function calculateMaxHourlyCount(
  weekdayHourlyCount: WeekdayHourlyCount,
): number {
  return (
    Math.max(
      ...Object.values(weekdayHourlyCount).flatMap((day) => Object.values(day)),
    ) || 1
  )
}
