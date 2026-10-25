import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SettingsView } from "@/components/dashboard/settings-view"

export const dynamic = "force-dynamic"

export default async function ClinicDashboardSettings({
  params,
}: {
  params: Promise<{ clinicId: string }>
}) {
  const { clinicId } = await params
  const supabase = await createClient()

  const { data: clinic, error } = await supabase
    .from("clinics")
    .select("id, name, address, city, phone, owner_id")
    .eq("id", clinicId)
    .single()

  if (error || !clinic) {
    notFound()
  }

  const { data: owner } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", clinic.owner_id)
    .maybeSingle()

  return (
    <SettingsView
      clinicId={clinicId}
      clinic={{
        name: clinic.name,
        address: `${clinic.address}, ${clinic.city}`,
        phone: clinic.phone,
        email: owner?.email ?? "",
      }}
    />
  )
}

