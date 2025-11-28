import {
  DAYS,
  HOURS,
  type WeekdayHourlyCount,
  calculateIntensity,
  calculateMaxHourlyCount,
} from '@upfluence/core'
import React from 'react'

export function WeeklyCalendarGraph({ weekdayHourlyCount }: Props) {
  const maxCount = calculateMaxHourlyCount(weekdayHourlyCount)
  return (
    <div
      className="weekly-calendar-graph"
      role="img"
      aria-label="Weekly calendar graph of events by day and hour"
    >
      {/* Header Row: Hours */}
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

      {/* Rows: Days */}
      {DAYS.map((dayName, dayIndex) => (
        <React.Fragment key={dayName}>
          <time className="weekly-calendar-graph-label">{dayName}</time>
          {HOURS.map((hour) => {
            const count = weekdayHourlyCount[dayIndex]?.[hour] ?? 0

            const intensity = calculateIntensity({ count, maxCount })

            return (
              <i
                key={hour}
                className={`weekly-calendar-graph-cell intensity-${intensity}`}
                title={`${dayName} ${hour}:00-${hour}:59 - ${count} events`}
              />
            )
          })}
        </React.Fragment>
      ))}
    </div>
  )
}

type Props = {
  weekdayHourlyCount: WeekdayHourlyCount
}
