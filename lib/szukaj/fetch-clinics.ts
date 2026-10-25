import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/database.types'
import type { Clinic } from '@/components/szukaj/clinic-card'

type ClinicRow = Pick<
  Database['public']['Tables']['clinics']['Row'],
  'id' | 'name' | 'address' | 'city' | 'description' | 'image_url' | 'is_active' | 'lat' | 'lng' | 'logo_url'
>

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=450&fit=crop'

function sanitizeIlike(value: string) {
  return value.replace(/%/g, '').replace(/_/g, '').trim()
}

function rowToClinic(row: ClinicRow, priceFrom: number): Clinic {
  const desc = row.description?.trim()
  return {
    id: row.id,
    name: row.name,
    image: row.image_url?.trim() || PLACEHOLDER_IMAGE,
    logoUrl: row.logo_url?.trim() || null,
    categories: ['Gabinet weterynaryjny'],
    address: `${row.address}, ${row.city}`,
    distance: row.city,
    rating: 0,
    reviewCount: 0,
    services: desc
      ? [desc.length > 160 ? `${desc.slice(0, 157)}…` : desc]
      : ['Wizyty weterynaryjne'],
    priceFrom: priceFrom > 0 ? Math.round(priceFrom) : 80,
    lat: row.lat ?? null,
    lng: row.lng ?? null,
  }
}

export async function fetchClinicsForSearch(
  queryRaw: string,
  cityRaw: string
): Promise<Clinic[]> {
  const supabase = await createClient()
  const query = sanitizeIlike(queryRaw)
  const city = sanitizeIlike(cityRaw)

  let builder = supabase
    .from('clinics')
    .select('id, name, address, city, description, image_url, is_active, lat, lng, logo_url')

  if (city) {
    builder = builder.ilike('city', `%${city}%`)
  }

  if (query) {
    const p = `%${query}%`
    builder = builder.or(`name.ilike.${p},description.ilike.${p}`)
  }

  const { data: rows, error } = await builder.order('name').limit(80)

  if (error || !rows?.length) {
    return []
  }

  const typed = rows as ClinicRow[]
  const ids = typed.map((r) => r.id)
  const { data: services } = await supabase
    .from('services')
    .select('clinic_id, price')
    .in('clinic_id', ids)

  const minPriceByClinic = new Map<string, number>()
  for (const s of services ?? []) {
    const prev = minPriceByClinic.get(s.clinic_id)
    if (prev === undefined || s.price < prev) {
      minPriceByClinic.set(s.clinic_id, s.price)
    }
  }

  return typed.map((row) =>
    rowToClinic(row, minPriceByClinic.get(row.id) ?? 0)
  )
}
