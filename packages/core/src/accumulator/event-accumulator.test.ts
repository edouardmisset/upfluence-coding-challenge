import { describe, it, expect, beforeEach } from 'vitest'
import { EventAccumulator } from './event-accumulator'

describe('PostAggregator', () => {
  let aggregator: EventAccumulator

  beforeEach(() => {
    aggregator = new EventAccumulator()
  })

  it('should initialize with empty data', () => {
    expect(aggregator.getData()).toEqual({})
    expect(aggregator.getAllTotals()).toEqual({})
  })

  it('should increment counts correctly', () => {
    // Sunday (0), 10:00 AM (10)
    const timestamp = 1672567200 // Jan 1 2023 10:00:00 UTC (Sunday)

    aggregator.increment('tweet', timestamp)

    const data = aggregator.getData()
    expect(data['tweet'][0][10]).toBe(1)
    expect(aggregator.getTotal('tweet')).toBe(1)
  })

  it('should handle multiple increments', () => {
    const timestamp = 1672567200 // Sunday 10am

    aggregator.increment('tweet', timestamp)
    aggregator.increment('tweet', timestamp)
    aggregator.increment('pin', timestamp)

    const data = aggregator.getData()
    expect(data['tweet'][0][10]).toBe(2)
    expect(data['pin'][0][10]).toBe(1)
    expect(aggregator.getTotal('tweet')).toBe(2)
    expect(aggregator.getTotal('pin')).toBe(1)
  })

  it('should handle different days and hours', () => {
    const sunday10am = 1672567200
    const monday11am = 1672657200 // Jan 2 2023 11:00:00 UTC

    aggregator.increment('tweet', sunday10am)
    aggregator.increment('tweet', monday11am)

    const data = aggregator.getData()
    expect(data['tweet'][0][10]).toBe(1)
    expect(data['tweet'][1][11]).toBe(1)
    expect(aggregator.getTotal('tweet')).toBe(2)
  })
})
