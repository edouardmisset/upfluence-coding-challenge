import type { Timestamp } from '../validators/schemas'

/**
 * Returns the UTC day of the week for a given timestamp.
 *
 * NOTE: 0 = Sunday, 1 = Monday, ...
 *
 * @param timestamp - The timestamp in seconds.
 * @returns The day of the week (0 = Sunday, 1 = Monday, ...).
 */
export function getDayOfWeek(timestamp: Timestamp): number {
  return new Date(timestamp * 1000).getUTCDay()
}

/**
 * Returns the UTC hour of the day for a given timestamp.
 * @param timestamp - The timestamp in seconds.
 * @returns The hour of the day (0-23).
 */
export function getHourOfDay(timestamp: Timestamp): number {
  return new Date(timestamp * 1000).getUTCHours()
}
