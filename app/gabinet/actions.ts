'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type ActionState = {
  ok: boolean
  error?: string
}

export type AddPetState = {
  ok: boolean
  petId?: string
  error?: string
}

function parseIntSafe(v: FormDataEntryValue | null) {
  if (typeof v !== 'string') return null
  const n = Number.parseInt(v, 10)
  return Number.isFinite(n) ? n : null
}

function parseString(v: FormDataEntryValue | null) {
  if (typeof v !== 'string') return null
  const s = v.trim()
  return s ? s : null
}

function parseLocalDateTime(date: string, time: string) {
  const m = date.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  const t = time.match(/^(\d{2}):(\d{2})$/)
  if (!m || !t) return null
  const y = Number.parseInt(m[1], 10)
  const mo = Number.parseInt(m[2], 10) - 1
  const d = Number.parseInt(m[3], 10)
  const hh = Number.parseInt(t[1], 10)
  const mm = Number.parseInt(t[2], 10)
  const dt = new Date(y, mo, d, hh, mm, 0, 0)
  if (Number.isNaN(dt.getTime())) return null
  return dt
}

export async function bookAppointment(formData: FormData): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'Zaloguj się, aby umówić wizytę.' }

  const clinicId = parseString(formData.get('clinicId'))
  if (!clinicId) return { ok: false, error: 'Nieprawidłowa klinika.' }

  const petId = parseString(formData.get('petId'))
  const serviceId = parseString(formData.get('serviceId'))
  const date = parseString(formData.get('date'))
  const time = parseString(formData.get('time'))

  if (!petId || !serviceId || !date || !time) return { ok: false, error: 'Uzupełnij wszystkie pola.' }

  const startTime = new Date(`${date}T${time}:00`)
  if (Number.isNaN(startTime.getTime())) return { ok: false, error: 'Nieprawidłowa data lub godzina.' }

  const [{ data: pet, error: petError }, { data: service, error: serviceError }] = await Promise.all([
    supabase.from('pets').select('id, owner_id').eq('id', petId).maybeSingle(),
    supabase.from('services').select('id, clinic_id, duration_minutes').eq('id', serviceId).maybeSingle(),
  ])

  if (petError || serviceError) return { ok: false, error: 'Nie udało się pobrać danych.' }
  if (!pet || pet.owner_id !== user.id) return { ok: false, error: 'Nieprawidłowy pacjent.' }
  if (!service || service.clinic_id !== clinicId) return { ok: false, error: 'Nieprawidłowa usługa.' }

  const endTime = new Date(startTime.getTime() + Math.max(0, service.duration_minutes) * 60_000)

  try {
    const { error } = await supabase.from('appointments').insert({
      client_id: user.id,
      clinic_id: clinicId,
      pet_id: petId,
      service_id: serviceId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    })

    if (error) {
      return { ok: false, error: 'Nie udało się umówić wizyty.' }
    }
  } catch (error) {
    return { ok: false, error: 'Nie udało się umówić wizyty.' }
  }

  revalidatePath(`/gabinet/${clinicId}`)
  return { ok: true }
}

export async function submitReview(clinicId: string, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'Zaloguj się, aby dodać opinię.' }

  const rating = parseIntSafe(formData.get('rating'))
  const comment = typeof formData.get('comment') === 'string' ? formData.get('comment') : ''
  const didHappen = formData.get('didHappen') === 'on'

  if (!didHappen) return { ok: false, error: 'Potwierdź, że wizyta się odbyła.' }
  if (!rating || rating < 1 || rating > 5) return { ok: false, error: 'Wybierz ocenę.' }

  const { data: appt, error: apptError } = await supabase
    .from('appointments')
    .select('id')
    .eq('client_id', user.id)
    .eq('clinic_id', clinicId)
    .in('status', ['completed', 'history'])
    .order('end_time', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (apptError) return { ok: false, error: 'Nie udało się zweryfikować wizyty.' }
  if (!appt) return { ok: false, error: 'Opinię możesz dodać dopiero po zakończonej wizycie.' }

  const { error } = await supabase.from('reviews').insert({
    appointment_id: appt.id,
    client_id: user.id,
    clinic_id: clinicId,
    rating,
    comment: comment.trim() ? comment.trim() : null,
  })

  if (error) return { ok: false, error: 'Nie udało się zapisać opinii.' }

  revalidatePath(`/gabinet/${clinicId}`)
  return { ok: true }
}

export async function addPetAction(formData: FormData): Promise<AddPetState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'Zaloguj się, aby dodać pacjenta.' }

  const clinicId = parseString(formData.get('clinicId'))
  if (!clinicId) return { ok: false, error: 'Nieprawidłowa klinika.' }

  const name = parseString(formData.get('name'))
  const speciesRaw = parseString(formData.get('species'))
  const breed = typeof formData.get('breed') === 'string' ? formData.get('breed').trim() : ''
  const age = parseIntSafe(formData.get('age'))

  if (!name || !speciesRaw) return { ok: false, error: 'Uzupełnij imię i gatunek.' }

  const species = speciesRaw === 'Pies' || speciesRaw === 'Kot' || speciesRaw === 'Inne' ? speciesRaw : null
  if (!species) return { ok: false, error: 'Wybierz poprawny gatunek.' }

  const { data, error } = await supabase
    .from('pets')
    .insert({
      owner_id: user.id,
      name,
      species,
      breed: breed ? breed : null,
      age: age ?? null,
    })
    .select('id')
    .single()

  if (error || !data) return { ok: false, error: 'Nie udało się dodać pacjenta.' }

  revalidatePath(`/gabinet/${clinicId}`)
  return { ok: true, petId: data.id }
}

