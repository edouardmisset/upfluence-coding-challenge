import { SocialMedias as SocialMedias, type Timestamp } from '../validators/schemas'
import { getDayOfWeek, getHourOfDay } from '../utils/time-utils'

/** [0 - 6] */
type WeekDay = number
/** [0 - 23] */
type HourOfDay = number
export type Accumulator = Record<
  SocialMedias,
  Record<WeekDay, Record<HourOfDay, number>>
>

export type Totals = Record<SocialMedias, number>

export class PostAggregator {
  private accumulator: Accumulator
  private totals: Totals

  constructor() {
    this.accumulator = {} as Accumulator
    this.totals = {} as Totals
  }

  increment(postType: SocialMedias, timestamp: Timestamp) {
    const day = getDayOfWeek(timestamp)
    const hour = getHourOfDay(timestamp)

    if (!this.accumulator[postType]) {
      this.accumulator[postType] = {}
      this.totals[postType] = 0
    }
    if (!this.accumulator[postType][day]) {
      this.accumulator[postType][day] = {}
    }
    if (!this.accumulator[postType][day][hour]) {
      this.accumulator[postType][day][hour] = 0
    }

    this.accumulator[postType][day][hour]++
    this.totals[postType]++
  }

  getData(): Accumulator {
    return this.accumulator
  }

  getTotal(postType: SocialMedias): number {
    return this.totals[postType] || 0
  }

  getAllTotals(): Totals {
    return this.totals
  }
}
