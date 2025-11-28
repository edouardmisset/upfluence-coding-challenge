import { describe, it, expect } from 'vitest'
import { getDayOfWeek, getHourOfDay } from './time-utils'

describe('timeUtils', () => {
  // Jan 1 2023 10:00:00 UTC is a Sunday
  const sunday10am = 1_672_567_200

  // Jan 2 2023 11:00:00 UTC is a Monday
  const monday11am = 1_672_657_200

  describe('getDayOfWeek', () => {
    it('should return 0 for Sunday', () => {
      expect(getDayOfWeek(sunday10am)).toBe(0)
    })

    it('should return 1 for Monday', () => {
      expect(getDayOfWeek(monday11am)).toBe(1)
    })
  })

  describe('getHourOfDay', () => {
    it('should return 10 for 10am', () => {
      expect(getHourOfDay(sunday10am)).toBe(10)
    })

    it('should return 11 for 11am', () => {
      expect(getHourOfDay(monday11am)).toBe(11)
    })
  })
})
