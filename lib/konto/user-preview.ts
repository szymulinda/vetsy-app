import type { User } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'

export type KontoUserPreview = {
  email: string
  greetingName: string
  displayFullName: string | null
  avatarUrl: string | null
}

function emailLocalGreeting(email: string) {
  const local = email.split('@')[0]?.trim() ?? ''
  if (!local) return 'tam'
  const word = local.replace(/[._-]+/g, ' ').split(/\s+/)[0] ?? local
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

function fallbackPreview(email: string): KontoUserPreview {
  return {
    email,
    greetingName: emailLocalGreeting(email),
    displayFullName: null,
    avatarUrl: null,
  }
}

function mapProfile(
  row: {
    full_name: string | null
    email: string
    avatar_url: string | null
  },
  authEmail: string
): KontoUserPreview {
  const email = row.email?.trim() || authEmail
  const full = row.full_name?.trim()
  if (!full) {
    return {
      email,
      greetingName: emailLocalGreeting(email),
      displayFullName: null,
      avatarUrl: row.avatar_url,
    }
  }
  const first = full.split(/\s+/)[0] ?? full
  return {
    email,
    greetingName: first,
    displayFullName: full,
    avatarUrl: row.avatar_url,
  }
}

export async function getKontoUserPreview(
  supabase: SupabaseClient<Database>,
  user: User
): Promise<KontoUserPreview> {
  const authEmail = user.email?.trim() ?? ""

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, email, avatar_url")
    .eq("id", user.id)
    .maybeSingle()

  if (error) {
    return fallbackPreview(authEmail)
  }

  if (!profile) {
    return fallbackPreview(authEmail)
  }

  return mapProfile(profile, authEmail)
}
