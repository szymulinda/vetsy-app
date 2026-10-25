'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function cancelAppointment(appointmentId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Musisz być zalogowany.')
  }

  const id = typeof appointmentId === 'string' ? appointmentId.trim() : ''
  if (!id) {
    throw new Error('Nieprawidłowy identyfikator wizyty.')
  }

  const { data: appt, error: readError } = await supabase
    .from('appointments')
    .select('id, client_id, status')
    .eq('id', id)
    .maybeSingle()

  if (readError) {
    console.error('Supabase Error w cancelAppointment:', readError)
    throw new Error(readError.message)
  }

  if (!appt) {
    throw new Error('Nie znaleziono wizyty.')
  }

  if (appt.client_id !== user.id) {
    throw new Error('Brak uprawnień do odwołania tej wizyty.')
  }

  const { error } = await supabase
    .from('appointments')
    .update({ status: 'odwolana' })
    .eq('id', id)

  if (error) {
    console.error('Supabase Error w cancelAppointment:', error)
    throw new Error(error.message)
  }

  revalidatePath('/konto')
  return { success: true as const }
}

export async function rescheduleAppointment(appointmentId: string, newDate: string, newTime: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false as const, error: 'Musisz być zalogowany.' }

  const date = typeof newDate === 'string' ? newDate.trim() : ''
  const time = typeof newTime === 'string' ? newTime.trim() : ''
  if (!date || !time) return { ok: false as const, error: 'Wybierz datę i godzinę.' }

  const start = new Date(`${date}T${time}:00`)
  if (Number.isNaN(start.getTime())) return { ok: false as const, error: 'Nieprawidłowa data lub godzina.' }

  const { data: appt, error: apptError } = await supabase
    .from('appointments')
    .select('id, service_id')
    .eq('id', appointmentId)
    .eq('client_id', user.id)
    .maybeSingle()

  if (apptError || !appt) return { ok: false as const, error: 'Nie znaleziono wizyty.' }

  let end: Date | null = null
  const { data: service } = await supabase
    .from('services')
    .select('duration_minutes')
    .eq('id', appt.service_id)
    .maybeSingle()

  const duration = Number(service?.duration_minutes ?? 0)
  if (Number.isFinite(duration) && duration > 0) {
    end = new Date(start.getTime() + duration * 60_000)
  }

  const payload: { start_time: string; end_time?: string } = { start_time: start.toISOString() }
  if (end) payload.end_time = end.toISOString()

  const { error } = await supabase
    .from('appointments')
    .update(payload)
    .eq('id', appointmentId)
    .eq('client_id', user.id)

  if (error) return { ok: false as const, error: error.message }

  revalidatePath('/konto')
  return { ok: true as const }
}

