import { z } from 'zod'
import { SOCIAL_MEDIAS } from '../constants'

export const SocialMediasSchema = z.enum(SOCIAL_MEDIAS)

export type SocialMedias = z.infer<typeof SocialMediasSchema>

export const ContentSchema = z.object({
  /** Unix timestamp in seconds */
  timestamp: z.number(),
})

export type Content = z.infer<typeof ContentSchema>

/** Unix timestamp in seconds */
export type Timestamp = Content['timestamp']
