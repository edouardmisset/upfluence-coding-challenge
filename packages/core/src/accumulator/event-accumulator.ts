/* eslint-disable sonarjs/redundant-type-aliases */
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

export const createEventAccumulator = () => {
  const accumulator = {} as Accumulator
  const totals = {} as Totals

  const increment = (socialMediaType: SocialMedias, timestamp: Timestamp) => {
    const day = getDayOfWeek(timestamp)
    const hour = getHourOfDay(timestamp)

    const socialMediaData = (accumulator[socialMediaType] ??= {})
    const dayData = (socialMediaData[day] ??= {})

    dayData[hour] = (dayData[hour] ?? 0) + 1
    totals[socialMediaType] = (totals[socialMediaType] ?? 0) + 1
  }

  const getData = (): Accumulator => accumulator

  const getTotal = (socialMediaType: SocialMedias): number =>
    totals[socialMediaType] ?? 0

  const getAllTotals = (): Totals => totals

  return {
    increment,
    getData,
    getTotal,
    getAllTotals,
  }
}
