import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PatientsView } from "@/components/dashboard/patients-view"

export const dynamic = "force-dynamic"

type AppointmentJoined = {
  id: string
  pets:
    | { id: string; name: string; species: string; weight_kg: number | null; age: number | null; breed: string | null }
    | { id: string; name: string; species: string; weight_kg: number | null; age: number | null; breed: string | null }[]
    | null
  profiles: { id: string; full_name: string | null; email: string } | { id: string; full_name: string | null; email: string }[] | null
}

function normalizeOne<T>(v: T | T[] | null): T | null {
  if (!v) return null
  return Array.isArray(v) ? v[0] ?? null : v
}

function mapSpecies(species: string): "Pies" | "Kot" | "Ptak" {
  const s = (species || "").toLowerCase()
  if (s.includes("kot")) return "Kot"
  if (s.includes("ptak")) return "Ptak"
  return "Pies"
}

export default async function ClinicDashboardPatients({
  params,
}: {
  params: Promise<{ clinicId: string }>
}) {
  const { clinicId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("appointments")
    .select("id, pets(*), profiles!appointments_client_id_fkey(id, full_name, email)")
    .eq("clinic_id", clinicId)
    .order("created_at", { ascending: false })

  if (error) {
    notFound()
  }

  const seen = new Set<string>()
  const patients = ((data ?? []) as AppointmentJoined[])
    .map((row) => {
      const pet = normalizeOne(row.pets)
      const owner = normalizeOne(row.profiles)
      if (!pet || !owner) return null
      const key = `${pet.id}:${owner.id}`
      if (seen.has(key)) return null
      seen.add(key)
      return {
        id: pet.id,
        clientName: owner.full_name?.trim() || "Brak danych",
        petName: pet.name,
        species: mapSpecies(pet.species),
        phone: "—",
        email: owner.email,
        weightKg: pet.weight_kg ?? null,
        age: pet.age ?? null,
        breed: pet.breed?.trim() ? pet.breed.trim() : null,
      }
    })
    .filter(Boolean) as {
    id: string
    clientName: string
    petName: string
    species: "Pies" | "Kot" | "Ptak"
    phone: string
    email: string
    weightKg: number | null
    age: number | null
    breed: string | null
  }[]

  return <PatientsView patients={patients} />
}

