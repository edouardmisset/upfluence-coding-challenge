import { describe, it, expect } from 'vitest'
import { calculateMaxHourlyCount } from './calculate-max-hourly-count'
import type { WeekdayHourlyCount } from '../accumulator/event-accumulator'

describe('calculateMaxHourlyCount', () => {
  it('should return 1 when all counts are 0 or empty', () => {
    const emptyData: WeekdayHourlyCount = {
      0: {},
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
    }
    expect(calculateMaxHourlyCount(emptyData)).toBe(1)
  })

  it('should return the maximum count from the data', () => {
    const data: WeekdayHourlyCount = {
      0: { 10: 5, 11: 2 },
      1: { 9: 10, 15: 3 },
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
    }
    // Max is 10
    expect(calculateMaxHourlyCount(data)).toBe(10)
  })

  it('should handle single entry correctly', () => {
    const data: WeekdayHourlyCount = {
      0: { 0: 100 },
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
    }
    expect(calculateMaxHourlyCount(data)).toBe(100)
  })

  it('should ignore zeros if there are larger numbers', () => {
    const data: WeekdayHourlyCount = {
      0: { 0: 0, 1: 5 },
      1: {},
      2: {},
      3: {},
      4: {},
      5: {},
      6: {},
    }
    expect(calculateMaxHourlyCount(data)).toBe(5)
  })
})
