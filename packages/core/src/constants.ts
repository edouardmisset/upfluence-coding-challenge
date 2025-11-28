export const SOCIAL_MEDIAS = [
  'tiktok_video',
  'instagram_media',
  'story',
  'youtube_video',
  'pin',
  'tweet',
  'article',
  'facebook_status',
  'twitch_stream',
] as const

export const SOCIAL_MEDIA_TEXT_MAP = {
  pin: 'Pinterest',
  instagram_media: 'Instagram',
  youtube_video: 'YouTube',
  article: 'Article',
  tweet: 'Tweeter',
  facebook_status: 'Facebook',
  twitch_stream: 'Twitch',
  tiktok_video: 'TikTok',
  story: 'Story',
} as const satisfies Record<(typeof SOCIAL_MEDIAS)[number], string>

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
export const HOURS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
] as const
