import { z } from 'zod'

export const SOCIAL_MEDIAS = [
  'instagram_media',
  'youtube_video',
  'pin',
  'tweet',
  'article',
  'facebook_status',
  'twitch_stream',
  'tiktok_video',
  'story',
] as const

export const PostTypeSchema = z.enum(SOCIAL_MEDIAS)

export type PostType = z.infer<typeof PostTypeSchema>

export const PostSchema = z.object({
  /** Unix timestamp in seconds */
  timestamp: z.number(),
})

export type Post = z.infer<typeof PostSchema>

export type Timestamp = Post['timestamp']
