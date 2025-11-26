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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(25, 1fr)',
        gap: 2,
      }}
    >
      {/* Header Row: Hours */}
      <div />
      {HOURS.map((h) => (
        <div
          key={h}
          style={{
            fontSize: 'var(--font-size-xs)',
            textAlign: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          {h}
        </div>
      ))}

      {/* Rows: Days */}
      {DAYS.map((dayName, dayIndex) => (
        <React.Fragment key={dayName}>
          <div
            style={{
              fontSize: 'var(--font-size-xs)',
              alignSelf: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            {dayName}
          </div>
          {HOURS.map((hour) => {
            const count = data[dayIndex]?.[hour] || 0
            // Calculate intensity [0-5]
            const intensity = count > 0 ? Math.ceil((count / maxCount) * 5) : 0

            return (
              <div
                key={hour}
                style={{
                  aspectRatio: '1 / 1',
                  background:
                    intensity > 0
                      ? `color-mix(in oklch, ${color}, transparent ${100 - intensity * 20}%)`
                      : 'var(--bg-surface-hover)',
                  borderRadius: 2,
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
