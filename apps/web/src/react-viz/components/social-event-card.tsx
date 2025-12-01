import { memo } from 'react'
import { WeeklyCalendarGraph } from './weekly-calendar-graph'
import {
  SOCIAL_MEDIA_TEXT_MAP,
  type SocialMedias,
  type WeekdayHourlyCount,
} from '@upfluence/core'

export const SocialEventCard = memo(
  ({
    socialMedia,
    count,
    weekdayHourlyCount,
    ...props
  }: Props & React.HTMLAttributes<HTMLElement>) => (
    <article className="social-event-card" data-social={socialMedia} {...props}>
      <header className="social-event-header">
        <h2 className="social-event-title">
          {SOCIAL_MEDIA_TEXT_MAP[socialMedia]}
        </h2>
        <data className="social-event-count" value={count}>
          {count}
        </data>
      </header>
      <WeeklyCalendarGraph weekdayHourlyCount={weekdayHourlyCount} />
    </article>
  ),
)

type Props = {
  socialMedia: SocialMedias
  count: number
  weekdayHourlyCount: WeekdayHourlyCount
}
