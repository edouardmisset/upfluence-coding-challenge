import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { PerformanceTracker } from './performance-tracker'

describe('PerformanceTracker', () => {
  let tracker: PerformanceTracker

  beforeEach(() => {
    vi.useFakeTimers()
    tracker = new PerformanceTracker()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should calculate rate correctly', () => {
    expect(tracker.getRate()).toBe(0)

    // 10 events in 1 second -> 10/s
    vi.advanceTimersByTime(1000)
    tracker.update(10)
    expect(tracker.getRate()).toBe(10)

    // 10 more events (20 total) in 2 seconds -> 5/s
    vi.advanceTimersByTime(2000)
    tracker.update(20)
    expect(tracker.getRate()).toBe(5)
  })

  it('should handle zero time difference', () => {
    tracker.update(10)
    expect(tracker.getRate()).toBe(0)
  })

  it('should reset', () => {
    vi.advanceTimersByTime(1000)
    tracker.update(10)

    tracker.reset()
    expect(tracker.getRate()).toBe(0)

    vi.advanceTimersByTime(1000)
    tracker.update(5)
    expect(tracker.getRate()).toBe(5)
  })
})
