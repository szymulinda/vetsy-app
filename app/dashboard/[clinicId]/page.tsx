import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CalendarView } from "@/components/dashboard/calendar-view"

export const dynamic = "force-dynamic"

type AppointmentRow = {
  id: string
  start_time: string
  end_time: string
  status: string
  services: { name: string } | { name: string }[] | null
  pets: { name: string } | { name: string }[] | null
}

function normalizeOne<T>(v: T | T[] | null): T | null {
  if (!v) return null
  return Array.isArray(v) ? v[0] ?? null : v
}

function toDayIndex(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 0
  const js = d.getDay()
  return js === 0 ? 6 : js - 1
}

function toSlotTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "8:00"
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`
}

function toDuration(startIso: string, endIso: string) {
  const s = new Date(startIso).getTime()
  const e = new Date(endIso).getTime()
  if (!Number.isFinite(s) || !Number.isFinite(e) || e <= s) return 1
  const minutes = Math.max(15, Math.round((e - s) / 60000))
  return Math.max(1, Math.round(minutes / 60))
}

function mapStatus(status: string) {
  if (status === "confirmed") return "confirmed" as const
  if (status === "completed") return "completed" as const
  return "pending" as const
}

export default async function ClinicDashboardCalendar({
  params,
}: {
  params: Promise<{ clinicId: string }>
}) {
  const { clinicId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("appointments")
    .select("id, start_time, end_time, status, services(name), pets(name)")
    .eq("clinic_id", clinicId)
    .order("start_time", { ascending: true })

  if (error) {
    notFound()
  }

  const appointments = ((data ?? []) as AppointmentRow[]).map((row) => ({
    id: row.id,
    title: normalizeOne(row.services)?.name ?? "Wizyta",
    pet: normalizeOne(row.pets)?.name ?? "Zwierzak",
    day: toDayIndex(row.start_time),
    startTime: toSlotTime(row.start_time),
    duration: toDuration(row.start_time, row.end_time),
    status: mapStatus(row.status),
  }))

  return <CalendarView appointments={appointments} clinicId={clinicId} />
}

