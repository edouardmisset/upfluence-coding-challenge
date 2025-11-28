import {
  DAYS,
  HOURS,
  type WeekdayHourlyCount,
  calculateIntensity,
  calculateMaxHourlyCount,
} from '@upfluence/core'
import React from 'react'

export function PunchCardGrid({ weekdayHourlyCount }: Props) {
  const maxCount = calculateMaxHourlyCount(weekdayHourlyCount)
  return (
    <div className="punch-card-grid">
      {/* Header Row: Hours */}
      <div />
      {HOURS.map((hour) => (
        <div key={hour} className="punch-card-label">
          {hour}
        </div>
      ))}

      {/* Rows: Days */}
      {DAYS.map((dayName, dayIndex) => (
        <React.Fragment key={dayName}>
          <div className="punch-card-label">{dayName}</div>
          {HOURS.map((hour) => {
            const count = weekdayHourlyCount[dayIndex]?.[hour] ?? 0

            const intensity = calculateIntensity({ count, maxCount })

            return (
              <div
                key={hour}
                className={`punch-card-cell intensity-${intensity}`}
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
