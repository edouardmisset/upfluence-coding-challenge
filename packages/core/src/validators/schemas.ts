import { z } from 'zod'

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

export const SocialMediasSchema = z.enum(SOCIAL_MEDIAS)

export type SocialMedias = z.infer<typeof SocialMediasSchema>

export const ContentSchema = z.object({
  /** Unix timestamp in seconds */
  timestamp: z.number(),
})

export type Content = z.infer<typeof ContentSchema>

export type Timestamp = Content['timestamp']
