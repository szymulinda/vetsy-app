import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ServicesView } from "@/components/dashboard/services-view"

export const dynamic = "force-dynamic"

export default async function ClinicDashboardServices({
  params,
}: {
  params: Promise<{ clinicId: string }>
}) {
  const { clinicId } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("services")
    .select("id, name, duration_minutes, price")
    .eq("clinic_id", clinicId)
    .order("name")

  if (error) {
    notFound()
  }

  return (
    <ServicesView
      clinicId={clinicId}
      services={(data ?? []).map((s) => ({
        id: s.id,
        name: s.name,
        duration: s.duration_minutes,
        price: s.price,
      }))}
    />
  )
}

