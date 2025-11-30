/**
 * Calculate the intensity level for a weekly calendar graph cell based on the count and
 * the maximum count.
 *
 * @param {number} count - The number of events for the given hour and day.
 * @param {number} maxCount - The maximum number of events across all hours and
 * days.
 * @returns {number} The intensity level (0-5), where 0 means no events and 5 is
 * the highest intensity.
 */
export function calculateIntensity({
  count,
  maxCount,
}: {
  count: number
  maxCount: number
}) {
  const numberOfBuckets = 5
  return 0 < count ? Math.ceil((count / maxCount) * numberOfBuckets) : 0
}
