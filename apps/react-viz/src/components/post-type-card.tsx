import React from 'react'
import { PunchCardGrid } from './punch-card-grid'
import type { PostType } from '@upfluence/core'

type Props = {
  type: PostType
  count: number
  data: Record<number, Record<number, number>>
}

const COLORS: Record<string, string> = {
  pin: 'var(--color-pinterest)',
  instagram_media: 'var(--color-instagram)',
  youtube_video: 'var(--color-youtube)',
  article: 'var(--color-article)',
  tweet: 'var(--color-twitter)',
  facebook_status: 'var(--color-facebook)',
}

export const PostTypeCard: React.FC<Props> = ({ type, count, data }) => {
  const color = COLORS[type] || 'var(--color-gray-500)'

  return (
    <div
      style={{
        border: '1px solid var(--color-gray-200)',
        padding: 'var(--space-md)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-surface)',
        boxShadow: '0 2px 4px var(--color-shadow)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-md)',
          alignItems: 'center',
        }}
      >
        <h3
          style={{
            margin: 0,
            textTransform: 'capitalize',
            color: 'var(--text-primary)',
          }}
        >
          {postTypeToText(type)}
        </h3>
        <span
          style={{
            fontWeight: 'var(--font-weight-bold)',
            fontSize: 'var(--font-size-xl)',
            color,
            background: 'var(--bg-surface-hover)',
            padding: 'var(--space-xs) var(--space-sm)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          {count}
        </span>
      </div>
      <PunchCardGrid data={data} color={color} />
    </div>
  )
}

const POST_TYPE_TEXT_MAP: Record<PostType, string> = {
  pin: 'Pinterest',
  instagram_media: 'Instagram',
  youtube_video: 'YouTube',
  article: 'Article',
  tweet: 'Tweeter',
  facebook_status: 'Facebook',
}

function postTypeToText(type: PostType): React.ReactNode {
  return POST_TYPE_TEXT_MAP[type] || type.replace('_', ' ')
}
