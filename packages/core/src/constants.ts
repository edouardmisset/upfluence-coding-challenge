/* eslint-disable @typescript-eslint/no-magic-numbers */
export const SOCIAL_MEDIAS = [
  'tiktok_video',
  'instagram_media',
  'story',
  'twitch_stream',
  'youtube_video',
  'pin',
  'article',
  'tweet',
  'facebook_status',
] as const

export const SOCIAL_MEDIA_TEXT_MAP = {
  tiktok_video: 'TikTok',
  instagram_media: 'Instagram',
  story: 'Story',
  twitch_stream: 'Twitch',
  youtube_video: 'YouTube',
  pin: 'Pinterest',
  article: 'Article',
  tweet: 'Twitter',
  facebook_status: 'Facebook',
} as const satisfies Record<(typeof SOCIAL_MEDIAS)[number], string>

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
export const HOURS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
] as const

export const STREAM_URL = 'https://stream.upfluence.co/stream'
export const REFRESH_RATE_MILLISECONDS = 1000
