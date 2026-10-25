import { createClient } from '@/lib/supabase/server'
import { NavbarClient, type NavbarUserState } from '@/components/gabinet/navbar-client'

export async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userState: NavbarUserState = { kind: 'guest' }

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .maybeSingle()

    if (profile?.role === 'clinic_owner') {
      const { data: clinic } = await supabase
        .from('clinics')
        .select('id, name')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle()

      userState = {
        kind: 'clinic_owner',
        clinicId: clinic?.id ?? null,
        clinicName: clinic?.name ?? null,
      }
    } else {
      const meta = (user.user_metadata ?? {}) as Record<string, unknown>
      const metaFullName =
        (typeof meta.full_name === 'string' && meta.full_name.trim()) ||
        (typeof meta.name === 'string' && meta.name.trim()) ||
        (typeof meta.owner_name === 'string' && meta.owner_name.trim()) ||
        null
      const metaGiven = typeof meta.given_name === 'string' ? meta.given_name.trim() : ''
      const metaFamily = typeof meta.family_name === 'string' ? meta.family_name.trim() : ''
      const metaComposed = [metaGiven, metaFamily].filter(Boolean).join(' ').trim() || null

      userState = {
        kind: 'client',
        fullName: profile?.full_name?.trim() || metaFullName || metaComposed,
      }
    }
  }

  return <NavbarClient userState={userState} />
}

