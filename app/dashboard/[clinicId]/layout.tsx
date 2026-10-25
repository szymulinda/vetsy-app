import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export const dynamic = "force-dynamic"

export default async function ClinicDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ clinicId: string }>
}) {
  const { clinicId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/konto")
  }

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id, name")
    .eq("id", clinicId)
    .eq("owner_id", user.id)
    .maybeSingle()

  if (!clinic) {
    redirect("/konto")
  }

  return (
    <DashboardShell clinicId={clinicId} clinicName={clinic.name}>
      {children}
    </DashboardShell>
  )
}

