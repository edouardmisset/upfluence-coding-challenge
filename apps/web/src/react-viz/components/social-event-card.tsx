import { PunchCardGrid } from './punch-card-grid'
import type { SocialMedias, WeekdayHourlyCount } from '@upfluence/core'

export function SocialEventCard({
  socialMedia,
  count,
  weekdayHourlyCount,
}: Props) {
  const color = COLORS[socialMedia] || 'var(--color-gray-500)'

  return (
    <div className="social-event-card">
      <div className="social-event-header">
        <h3 className="social-event-title">{postTypeToText(socialMedia)}</h3>
        <span className="social-event-count" data-social={socialMedia}>
          {count}
        </span>
      </div>
      <PunchCardGrid weekdayHourlyCount={weekdayHourlyCount} color={color} />
    </div>
  )
}

// TODO : this should be in another file (constants.ts in the core package) and also contain the colors, etc.
const SOCIAL_MEDIA_TEXT_MAP: Record<SocialMedias, string> = {
  pin: 'Pinterest',
  instagram_media: 'Instagram',
  youtube_video: 'YouTube',
  article: 'Article',
  tweet: 'Tweeter',
  facebook_status: 'Facebook',
  twitch_stream: 'Twitch',
  tiktok_video: 'TikTok',
  story: 'Story',
}

const COLORS: Record<string, string> = {
  pin: 'var(--color-pinterest)',
  instagram_media: 'var(--color-instagram)',
  youtube_video: 'var(--color-youtube)',
  article: 'var(--color-article)',
  tweet: 'var(--color-twitter)',
  facebook_status: 'var(--color-facebook)',
  twitch_stream: 'var(--color-twitch)',
  tiktok_video: 'var(--color-tiktok)',
  story: 'var(--color-story)',
}

// TODO : Move to helper file in the core package
function postTypeToText(socialMedia: SocialMedias): string {
  return SOCIAL_MEDIA_TEXT_MAP[socialMedia] || socialMedia.replace('_', ' ')
}

type Props = {
  socialMedia: SocialMedias
  count: number
  weekdayHourlyCount: WeekdayHourlyCount
}
