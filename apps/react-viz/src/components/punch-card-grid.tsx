import React from 'react'

type Props = {
  data: Record<number, Record<number, number>> // day -> hour -> count
  color: string
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOURS = Array.from({ length: 24 }, (_, i) => i)

export const PunchCardGrid: React.FC<Props> = ({ data, color }) => {
  const maxCount =
    Math.max(...Object.values(data).flatMap((day) => Object.values(day))) || 1

  return (
    <div className="punch-card-grid">
      {/* Header Row: Hours */}
      <div />
      {HOURS.map((h) => (
        <div key={h} className="punch-card-label">
          {h}
        </div>
      ))}

      {/* Rows: Days */}
      {DAYS.map((dayName, dayIndex) => (
        <React.Fragment key={dayName}>
          <div className="punch-card-row-label">{dayName}</div>
          {HOURS.map((hour) => {
            const count = data[dayIndex]?.[hour] || 0
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
                title={`${dayName} ${hour}:00 - ${count} posts`}
              />
            )
          })}
        </React.Fragment>
      ))}
    </div>
  )
}
