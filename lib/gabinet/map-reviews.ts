import type { Database } from '@/lib/supabase/database.types'

export type ClinicReviewUi = {
  id: string
  author: string
  avatarUrl: string | null
  rating: number
  createdAt: string | null
  comment: string | null
}

type ProfileSnippet = Pick<
  Database['public']['Tables']['profiles']['Row'],
  'full_name' | 'avatar_url'
>

export type ReviewJoinedRow = {
  id: string
  rating: number
  comment: string | null
  created_at: string | null
  profiles: ProfileSnippet | ProfileSnippet[] | null
}

function normalizeProfile(p: ProfileSnippet | ProfileSnippet[] | null): ProfileSnippet | null {
  if (!p) return null
  return Array.isArray(p) ? p[0] ?? null : p
}

function authorLabel(fullName: string | null | undefined): string {
  const s = fullName?.trim()
  if (!s) return 'Klient'
  const parts = s.split(/\s+/)
  if (parts.length === 1) return parts[0]
  const last = parts[parts.length - 1]
  const initial = last[0]?.toUpperCase() ?? ''
  return `${parts[0]} ${initial}.`
}

export function mapReviewRows(rows: ReviewJoinedRow[]): ClinicReviewUi[] {
  return rows.map((row) => {
    const profile = normalizeProfile(row.profiles)
    return {
      id: row.id,
      author: authorLabel(profile?.full_name ?? null),
      avatarUrl: profile?.avatar_url ?? null,
      rating: row.rating,
      createdAt: row.created_at,
      comment: row.comment,
    }
  })
}
