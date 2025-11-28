import type { WeekdayHourlyCount } from '@upfluence/core'
import React from 'react'

type Props = {
  weekdayHourlyCount: WeekdayHourlyCount // day -> hour -> count
  color: string
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

export function PunchCardGrid({ weekdayHourlyCount, color }: Props) {
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
            const count = weekdayHourlyCount[dayIndex]?.[hour] || 0
            // Calculate intensity [0-5]
            const intensity = count > 0 ? Math.ceil((count / maxCount) * 5) : 0

            return (
              <div
                key={hour}
                className="punch-card-cell"
                style={{
                  background:
                    intensity > 0
                      ? `color-mix(in oklch, ${color}, transparent ${100 - intensity * 20}%)`
                      : 'var(--bg-surface-hover)',
                }}
                title={`${dayName} ${hour}:00 - ${count} events`}
              />
            )
          })}
        </React.Fragment>
      ))}
    </div>
  )
}
