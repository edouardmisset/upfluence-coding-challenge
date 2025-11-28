import { PunchCardGrid } from './punch-card-grid'
import {
  SOCIAL_MEDIA_TEXT_MAP,
  type SocialMedias,
  type WeekdayHourlyCount,
} from '@upfluence/core'

export function SocialEventCard({
  socialMedia,
  count,
  weekdayHourlyCount,
}: Props) {
  return (
    <div className="social-event-card" data-social={socialMedia}>
      <div className="social-event-header">
        <h3 className="social-event-title">
          {SOCIAL_MEDIA_TEXT_MAP[socialMedia]}
        </h3>
        <span className="social-event-count">{count}</span>
      </div>
      <PunchCardGrid weekdayHourlyCount={weekdayHourlyCount} />
    </div>
  )
}

type Props = {
  socialMedia: SocialMedias
  count: number
  weekdayHourlyCount: WeekdayHourlyCount
}
