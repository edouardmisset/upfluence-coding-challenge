import {
  DAYS,
  HOURS,
  type WeekdayHourlyCount,
  calculateIntensity,
  calculateMaxHourlyCount,
} from '@upfluence/core'
import { memo } from 'react'

export function WeeklyCalendarGraph({
  weekdayHourlyCount,
}: WeeklyCalendarGraphProps) {
  const maxCount = calculateMaxHourlyCount(weekdayHourlyCount)
  return (
    <div
      className="weekly-calendar-graph"
      role="img"
      aria-label="Weekly calendar graph of events by day and hour"
    >
      <HoursHeader />

      {DAYS.map((dayName, dayIndex) => (
        <DayRow
          key={dayName}
          dayName={dayName}
          dayIndex={dayIndex}
          weekdayHourlyCount={weekdayHourlyCount}
          maxCount={maxCount}
        />
      ))}
    </div>
  )
}

const HoursHeader = memo(() => (
  <>
    <div />
    {HOURS.map((hour) => (
      <time
        dateTime={`${hour}:00`}
        key={hour}
        className="weekly-calendar-graph-label"
      >
        {hour}
      </time>
    ))}
  </>
))

const DayRow = memo(
  ({ dayName, dayIndex, weekdayHourlyCount, maxCount }: DayRowProps) => (
    <>
      <time className="weekly-calendar-graph-label">{dayName}</time>
      {HOURS.map((hour) => (
        <HourCell
          key={hour}
          hour={hour}
          dayName={dayName}
          count={weekdayHourlyCount[dayIndex]?.[hour] ?? 0}
          maxCount={maxCount}
        />
      ))}
    </>
  ),
)

const HourCell = memo(({ hour, dayName, count, maxCount }: HourCellProps) => {
  const intensity = calculateIntensity({ count, maxCount })

  return (
    <i
      className={`weekly-calendar-graph-cell intensity-${intensity}`}
      title={`${dayName} ${hour}:00-${hour}:59 - ${count} events`}
    />
  )
})

type DayRowProps = {
  dayName: string
  dayIndex: number
  weekdayHourlyCount: WeekdayHourlyCount
  maxCount: number
}

type HourCellProps = {
  hour: number
  dayName: string
  count: number
  maxCount: number
}

type WeeklyCalendarGraphProps = {
  weekdayHourlyCount: WeekdayHourlyCount
}
