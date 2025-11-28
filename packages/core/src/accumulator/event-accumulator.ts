import { SocialMedias, type Timestamp } from '../validators/schemas'
import { getDayOfWeek, getHourOfDay } from '../utils/time-utils'

/** Days of the week: [0 - 6] */
type WeekDay = number
/** 24 hours: [0 - 23] */
type HourOfDay = number
/** Mapping of day to hour to count, e.g., { 2: { 16: 3 } } */
export type WeekdayHourlyCount = Record<WeekDay, Record<HourOfDay, number>>

export type Accumulator = Record<SocialMedias, WeekdayHourlyCount>

export type Totals = Record<SocialMedias, number>

export class EventAccumulator {
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
