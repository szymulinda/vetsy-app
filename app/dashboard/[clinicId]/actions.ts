'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function parseAddress(input: string) {
  const s = input.trim()
  if (!s) return { address: '', city: '' }
  const idx = s.lastIndexOf(',')
  if (idx === -1) return { address: s, city: '' }
  return {
    address: s.slice(0, idx).trim(),
    city: s.slice(idx + 1).trim(),
  }
}

export async function updateClinicSettings(
  clinicId: string,
  payload: { name: string; addressCombined: string; phone: string }
) {
  const supabase = await createClient()
  const { address, city } = parseAddress(payload.addressCombined)
  const resolvedAddress = address || payload.addressCombined.trim()
  const resolvedCity = city || 'Do uzupełnienia'
  const q = `${resolvedAddress}, ${resolvedCity}`
  let lat: number | null = null
  let lng: number | null = null

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`,
      { headers: { 'User-Agent': 'VetsyApp/1.0' } }
    )
    const data = (await res.json()) as Array<{ lat?: string; lon?: string }>
    if (Array.isArray(data) && data.length > 0) {
      const latNum = Number.parseFloat(String(data[0]?.lat ?? ''))
      const lngNum = Number.parseFloat(String(data[0]?.lon ?? ''))
      lat = Number.isFinite(latNum) ? latNum : null
      lng = Number.isFinite(lngNum) ? lngNum : null
    }
  } catch {
    lat = null
    lng = null
  }

  const { error } = await supabase
    .from('clinics')
    .update({
      name: payload.name,
      address: resolvedAddress,
      city: resolvedCity,
      phone: payload.phone,
      lat,
      lng,
    })
    .eq('id', clinicId)

  if (error) {
    return { ok: false as const, error: error.message }
  }

  revalidatePath(`/dashboard/${clinicId}/ustawienia`)
  return { ok: true as const }
}

export async function createService(
  clinicId: string,
  payload: { name: string; durationMinutes: number; price: number }
) {
  const supabase = await createClient()
  const { error } = await supabase.from('services').insert({
    clinic_id: clinicId,
    name: payload.name,
    duration_minutes: payload.durationMinutes,
    price: payload.price,
  })

  if (error) {
    return { ok: false as const, error: error.message }
  }

  revalidatePath(`/dashboard/${clinicId}/uslugi`)
  return { ok: true as const }
}

export async function updateService(
  clinicId: string,
  serviceId: string,
  payload: { name: string; durationMinutes: number; price: number }
) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('services')
    .update({
      name: payload.name,
      duration_minutes: payload.durationMinutes,
      price: payload.price,
    })
    .eq('id', serviceId)
    .eq('clinic_id', clinicId)

  if (error) {
    return { ok: false as const, error: error.message }
  }

  revalidatePath(`/dashboard/${clinicId}/uslugi`)
  return { ok: true as const }
}

export async function deleteService(clinicId: string, serviceId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', serviceId)
    .eq('clinic_id', clinicId)

  if (error) {
    return { ok: false as const, error: error.message }
  }

  revalidatePath(`/dashboard/${clinicId}/uslugi`)
  return { ok: true as const }
}

export async function createPet(payload: {
  ownerId: string
  name: string
  species: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from('pets').insert({
    owner_id: payload.ownerId,
    name: payload.name,
    species: payload.species,
  })

  if (error) {
    return { ok: false as const, error: error.message }
  }

  return { ok: true as const }
}

export async function createAppointment(
  clinicId: string,
  payload: {
    clientId: string
    petId: string
    serviceId: string
    startTime: string
    endTime: string
    status: string
  }
) {
  const supabase = await createClient()
  const { error } = await supabase.from('appointments').insert({
    clinic_id: clinicId,
    client_id: payload.clientId,
    pet_id: payload.petId,
    service_id: payload.serviceId,
    start_time: payload.startTime,
    end_time: payload.endTime,
    status: payload.status,
  })

  if (error) {
    return { ok: false as const, error: error.message }
  }

  revalidatePath(`/dashboard/${clinicId}`)
  return { ok: true as const }
}

