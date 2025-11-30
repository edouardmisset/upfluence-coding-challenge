import { describe, it, expect, beforeEach } from 'vitest'
import { createEventAccumulator } from './event-accumulator'

describe('PostAggregator', () => {
  let aggregator: ReturnType<typeof createEventAccumulator>

  beforeEach(() => {
    aggregator = createEventAccumulator()
  })

  it('should initialize with empty data', () => {
    expect(aggregator.getData()).toEqual({})
    expect(aggregator.getAllTotals()).toEqual({
      instagram_media: 0,
      story: 0,
      tiktok_video: 0,
      youtube_video: 0,
      twitch_stream: 0,
      pin: 0,
      tweet: 0,
      article: 0,
      facebook_status: 0,
    })
  })

  it('should increment counts correctly', () => {
    // Sunday (0), 10:00 AM (10)
    const timestamp = 1_672_567_200 // Jan 1 2023 10:00:00 UTC (Sunday)

    aggregator.increment('tweet', timestamp)

    const data = aggregator.getData()
    expect(data.tweet?.[0]?.[10] ?? 0).toBe(1)
    expect(aggregator.getTotal('tweet')).toBe(1)
  })

  it('should handle multiple increments', () => {
    const timestamp = 1_672_567_200 // Sunday 10am

    aggregator.increment('tweet', timestamp)
    aggregator.increment('tweet', timestamp)
    aggregator.increment('pin', timestamp)

    const data = aggregator.getData()
    expect(data.tweet?.[0]?.[10] ?? 0).toBe(2)
    expect(data.pin?.[0]?.[10] ?? 0).toBe(1)
    expect(aggregator.getTotal('tweet')).toBe(2)
    expect(aggregator.getTotal('pin')).toBe(1)
  })

  it('should handle different days and hours', () => {
    const sunday10am = 1_672_567_200
    const monday11am = 1_672_657_200 // Jan 2 2023 11:00:00 UTC

    aggregator.increment('tweet', sunday10am)
    aggregator.increment('tweet', monday11am)

    const data = aggregator.getData()
    expect(data.tweet?.[0]?.[10] ?? 0).toBe(1)
    expect(data.tweet?.[1]?.[11] ?? 0).toBe(1)
    expect(aggregator.getTotal('tweet')).toBe(2)
  })
})
