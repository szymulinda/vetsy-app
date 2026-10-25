import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/gabinet/navbar'
import { ClinicProfileView } from '@/components/gabinet/clinic-profile-view'
import { mapServiceRows } from '@/lib/gabinet/map-clinic-services'
import { mapReviewRows, type ReviewJoinedRow } from '@/lib/gabinet/map-reviews'
import type { Database } from '@/lib/supabase/database.types'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type ClinicPhotoPick = Pick<
  Database['public']['Tables']['clinic_photos']['Row'],
  'id' | 'url' | 'description'
>

type PetPick = Pick<
  Database['public']['Tables']['pets']['Row'],
  'id' | 'name' | 'species'
>

type Props = {
  params: Promise<{ id: string }>
}

export default async function GabinetPage({ params }: Props) {
  const resolvedParams = await params
  const id = resolvedParams.id
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: clinic, error } = await supabase
    .from('clinics')
    .select('id, name, description, city, address, phone, logo_url, image_url, created_at, is_verified')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    notFound()
  }

  if (!clinic) {
    notFound()
  }

  const [
    { data: serviceRows },
    { data: reviewRows },
    { data: photoRows },
    { data: petRows },
    { data: eligibleAppointment },
    { data: busyAppointments },
  ] =
    await Promise.all([
    supabase.from('services').select('*').eq('clinic_id', id).order('category', { ascending: true }).order('name'),
    supabase
      .from('reviews')
      .select('id, rating, comment, created_at, profiles(full_name, avatar_url)')
      .eq('clinic_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('clinic_photos')
      .select('*')
      .eq('clinic_id', id)
      .order('created_at', { ascending: true }),
    user
      ? supabase.from('pets').select('id, name, species').eq('owner_id', user.id).order('created_at', { ascending: true })
      : Promise.resolve({ data: null }),
    user
      ? supabase
          .from('appointments')
          .select('id')
          .eq('client_id', user.id)
          .eq('clinic_id', id)
          .in('status', ['completed', 'history'])
          .order('end_time', { ascending: false })
          .limit(1)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from('appointments')
      .select('start_time, end_time, status')
      .eq('clinic_id', id)
      .neq('status', 'odwolana'),
  ])

  const services = mapServiceRows(serviceRows ?? [])
  const reviews = mapReviewRows((reviewRows ?? []) as ReviewJoinedRow[])
  const photos = (photoRows ?? []) as ClinicPhotoPick[]
  const pets = (petRows ?? []) as PetPick[]
  const canReview = Boolean(eligibleAppointment)

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <ClinicProfileView
        clinic={clinic}
        services={services}
        reviews={reviews}
        photos={photos}
        pets={pets}
        isLoggedIn={Boolean(user)}
        canReview={canReview}
        busyAppointments={(busyAppointments ?? []).map((a) => ({
          start_time: a.start_time,
          end_time: a.end_time,
        }))}
      />
    </div>
  )
}
