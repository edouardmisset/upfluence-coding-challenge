import { DAYS, HOURS, type WeekdayHourlyCount } from '@upfluence/core'
import React from 'react'

type Props = {
  weekdayHourlyCount: WeekdayHourlyCount
}

export function PunchCardGrid({ weekdayHourlyCount }: Props) {
  const maxCount =
    Math.max(
      ...Object.values(weekdayHourlyCount).flatMap((day) => Object.values(day)),
    ) || 1
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
            // Calculate intensity [0-5]
            const intensity = 0 < count ? Math.ceil((count / maxCount) * 5) : 0

            return (
              <div
                key={hour}
                className="punch-card-cell"
                data-intensity={intensity}
                title={`${dayName} ${hour}:00-${hour}:59 - ${count} events`}
              />
            )
          })}
        </React.Fragment>
      ))}
    </div>
  )
}
