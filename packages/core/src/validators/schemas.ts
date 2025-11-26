import { z } from 'zod'

export const SOCIAL_MEDIAS = [
  'pin',
  'instagram_media',
  'youtube_video',
  'article',
  'tweet',
  'facebook_status',
] as const

export const PostTypeSchema = z.enum(SOCIAL_MEDIAS)

export type PostType = z.infer<typeof PostTypeSchema>

export const PostSchema = z.object({
  timestamp: z.number(), // Unix timestamp in seconds
})

export type Post = z.infer<typeof PostSchema>
