import type { WeekdayHourlyCount } from '../accumulator/event-accumulator'

/**
 * Calculates the maximum hourly count from a WeekdayHourlyCount object.
 * Note: If all counts are falsy (0 or empty), it returns 1.
 *
 * @param {WeekdayHourlyCount} weekdayHourlyCount - An object mapping weekdays
 * to hourly counts.
 * @returns {number} The maximum count found in any hour of any day, or 1 if all
 * values are falsy.
 */
export function calculateMaxHourlyCount(
  weekdayHourlyCount: WeekdayHourlyCount,
): number {
  return (
    Math.max(
      0,
      ...Object.values(weekdayHourlyCount).flatMap((day) => Object.values(day)),
    ) || 1
  )
}
