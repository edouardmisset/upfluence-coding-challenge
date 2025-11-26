import { PostType } from '../validators/schemas'
import { getDayOfWeek, getHourOfDay } from '../utils/time-utils'

export type AggregatedData = Record<
  string,
  Record<number, Record<number, number>>
>

export class PostAggregator {
  private data: AggregatedData
  private totals: Record<string, number>

  constructor() {
    this.data = {}
    this.totals = {}
  }

  increment(postType: PostType, timestamp: number) {
    const day = getDayOfWeek(timestamp)
    const hour = getHourOfDay(timestamp)

    if (!this.data[postType]) {
      this.data[postType] = {}
      this.totals[postType] = 0
    }
    if (!this.data[postType][day]) {
      this.data[postType][day] = {}
    }
    if (!this.data[postType][day][hour]) {
      this.data[postType][day][hour] = 0
    }

    this.data[postType][day][hour]++
    this.totals[postType]++
  }

  getData(): AggregatedData {
    return this.data
  }

  getTotal(postType: PostType): number {
    return this.totals[postType] || 0
  }

  getAllTotals(): Record<string, number> {
    return this.totals
  }
}
