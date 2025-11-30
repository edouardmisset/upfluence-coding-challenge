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
  const totals = {
    instagram_media: 0,
    story: 0,
    tiktok_video: 0,
    youtube_video: 0,
    twitch_stream: 0,
    pin: 0,
    tweet: 0,
    article: 0,
    facebook_status: 0,
  } satisfies Totals

  const increment = (socialMediaType: SocialMedias, timestamp: Timestamp) => {
    const day = getDayOfWeek(timestamp)
    const hour = getHourOfDay(timestamp)

    if (!accumulator[socialMediaType]) {
      accumulator[socialMediaType] = {} as WeekdayHourlyCount
    }
    if (!accumulator[socialMediaType][day]) {
      accumulator[socialMediaType][day] = {} as Record<HourOfDay, number>
    }
    accumulator[socialMediaType][day][hour] =
      (accumulator[socialMediaType][day][hour] ?? 0) + 1
    totals[socialMediaType] = (totals[socialMediaType] ?? 0) + 1
  }

  const getData = (): Accumulator => accumulator

  const getTotal = (socialMediaType: SocialMedias): number =>
    totals[socialMediaType] ?? 0

  const getAllTotals = (): Totals => {
    return Object.fromEntries(
      Object.entries(totals).toSorted(([, a], [, b]) => b - a),
    ) as Totals
  }

  return {
    increment,
    getData,
    getTotal,
    getAllTotals,
  }
}
