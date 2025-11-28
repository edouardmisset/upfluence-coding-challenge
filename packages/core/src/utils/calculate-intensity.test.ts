import { describe, it, expect } from 'vitest'
import { calculateIntensity } from './calculate-intensity'

describe('calculateIntensity', () => {
  it.each([
    { count: 0, maxCount: 100, expected: 0, desc: 'returns 0 when count is 0' },
    {
      count: 100,
      maxCount: 100,
      expected: 5,
      desc: 'returns 5 when count equals maxCount',
    },
    {
      count: 1,
      maxCount: 100,
      expected: 1,
      desc: 'returns 1 for a very small non-zero count',
    },
    {
      count: 50,
      maxCount: 100,
      expected: 3,
      desc: 'returns 3 for count=50, maxCount=100 (intermediate intensity)',
    },
    {
      count: 20,
      maxCount: 100,
      expected: 1,
      desc: 'returns 1 for count=20, maxCount=100 (intermediate intensity)',
    },
    {
      count: 80,
      maxCount: 100,
      expected: 4,
      desc: 'returns 4 for count=80, maxCount=100 (intermediate intensity)',
    },
  ])('should $desc', ({ count, maxCount, expected }) => {
    expect(calculateIntensity({ count, maxCount })).toBe(expected)
  })
})
