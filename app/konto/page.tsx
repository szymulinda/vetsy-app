import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { signOut } from "@/app/auth/actions"
import { getKontoUserPreview } from "@/lib/konto/user-preview"
import { Navbar } from "@/components/gabinet/navbar"
import { WelcomeHero } from "@/components/konto/welcome-hero"
import { PetCards } from "@/components/konto/pet-cards"
import { Appointments } from "@/components/konto/appointments"
import { FavoriteClinics } from "@/components/konto/favorite-clinics"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  const preview = await getKontoUserPreview(supabase, user)

  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      *,
      clinic:clinics(name, address, city),
      pet:pets(name),
      service:services(name)
    `)
    .eq('client_id', user.id)
    .order('start_time', { ascending: true })

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main>
        <WelcomeHero greetingName={preview.greetingName} email={preview.email} />
        <Appointments appointments={appointments ?? []} />
        <PetCards />
        <FavoriteClinics />
      </main>
      <footer className="border-t border-stone-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-stone-500">
              © 2025 Vetsy. Wszystkie prawa zastrzeżone.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-sm text-stone-500 transition-colors hover:text-emerald-600"
              >
                Polityka prywatności
              </a>
              <a
                href="#"
                className="text-sm text-stone-500 transition-colors hover:text-emerald-600"
              >
                Regulamin
              </a>
              <a
                href="#"
                className="text-sm text-stone-500 transition-colors hover:text-emerald-600"
              >
                Kontakt
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
