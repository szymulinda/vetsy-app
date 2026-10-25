'use client'

import { Button } from '@/components/ui/button'
import { MapPin, Heart, Calendar, Star } from 'lucide-react'
import { HeroSearch } from '@/components/home/hero-search'
import { VETSY_LOGO_URL } from '@/lib/branding'

const clinics = [
  {
    id: 1,
    name: 'Przychodnia Weterynaryjna Cztery Łapy',
    address: 'ul. Kwiatowa 12, Warszawa',
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=450&fit=crop',
  },
  {
    id: 2,
    name: 'Salon Groomerski PsiRaj',
    address: 'ul. Słoneczna 45, Kraków',
    rating: 4.8,
    reviews: 96,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=450&fit=crop',
  },
  {
    id: 3,
    name: 'Gabinet Weterynaryjny MiauMiau',
    address: 'ul. Leśna 8, Poznań',
    rating: 4.7,
    reviews: 84,
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&h=450&fit=crop',
  },
]

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-stone-50 pt-8 pb-16 md:pt-14 md:pb-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-20 h-72 w-72 rounded-full bg-emerald-100 opacity-40 blur-3xl" />
        <div className="absolute top-40 right-0 h-96 w-96 rounded-full bg-orange-100 opacity-30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-8 text-center">
        <h1 className="text-balance text-4xl font-extrabold tracking-tight text-stone-800 sm:text-5xl md:text-6xl">
          Znajdź najlepszą opiekę dla swojego pupila
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-stone-600">
          Rezerwuj wizyty u sprawdzonych weterynarzy i groomerów w kilka sekund.
          Szybko, wygodnie i bezstresowo.
        </p>

        <HeroSearch />
      </div>
    </section>
  )
}

function ValuePropSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-8">
        <h2 className="mb-10 text-balance text-center text-3xl font-bold text-stone-800">
          Jedna platforma, dwie perspektywy
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-stone-50 p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12)]">
            <div className="absolute top-0 left-6 h-16 w-1 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-200" />
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-emerald-200 bg-white shadow-sm">
              <Heart className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-stone-800">Dla właścicieli zwierząt</h3>
            <p className="mb-6 text-sm leading-relaxed text-stone-500">
              Cyfrowa książeczka zdrowia Twojego pupila zawsze pod ręką. Łatwe
              rezerwacje online, przypomnienia o wizytach i pełna historia
              leczenia w jednym miejscu.
            </p>
            <Button
              variant="outline"
              className="rounded-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              Znajdź gabinet
            </Button>
          </div>

          <div className="relative rounded-3xl border border-stone-200 bg-gradient-to-br from-stone-100 to-stone-50 p-8 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12)]">
            <div className="absolute top-0 left-6 h-16 w-1 rounded-full bg-gradient-to-b from-emerald-600 to-emerald-400" />
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-stone-300 bg-white shadow-sm">
              <Calendar className="h-8 w-8 text-emerald-700" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-stone-800">Dla gabinetów i salonów</h3>
            <p className="mb-6 text-sm leading-relaxed text-stone-500">
              Zarządzaj kalendarzem bez wysiłku. Automatyczne przypomnienia dla
              klientów, mniej nieobecności i więcej czasu na to, co kochasz. 30
              dni za darmo!
            </p>
            <Button className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700">
              Załóż darmowe konto
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function ClinicsSection() {
  return (
    <section className="bg-stone-50 py-16">
      <div className="mx-auto max-w-7xl px-8">
        <h2 className="mb-10 text-balance text-center text-3xl font-bold text-stone-800">
          Przyjazne gabinety w Twojej okolicy
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clinics.map((clinic) => (
            <div
              key={clinic.id}
              className="overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={clinic.image}
                  alt={clinic.name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-lg font-bold text-stone-800">{clinic.name}</h3>
                <div className="mb-3 flex items-center gap-2 text-stone-500">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{clinic.address}</span>
                </div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(clinic.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-stone-700">{clinic.rating}</span>
                  <span className="text-sm text-stone-500">({clinic.reviews} opinii)</span>
                </div>
                <Button className="w-full rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
                  Umów wizytę
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-emerald-900 py-12 text-emerald-50">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <img
                src={VETSY_LOGO_URL}
                alt="Vetsy"
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
            <p className="max-w-sm leading-relaxed text-white">
              Łączymy właścicieli zwierząt z najlepszymi specjalistami w okolicy. Bo Twój
              pupil zasługuje na najlepszą opiekę.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">O nas</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-emerald-200 transition-colors hover:text-white">
                  Nasza historia
                </a>
              </li>
              <li>
                <a href="#" className="text-emerald-200 transition-colors hover:text-white">
                  Zespół
                </a>
              </li>
              <li>
                <a href="#" className="text-emerald-200 transition-colors hover:text-white">
                  Kariera
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Wsparcie</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-emerald-200 transition-colors hover:text-white">
                  Centrum pomocy
                </a>
              </li>
              <li>
                <a href="#" className="text-emerald-200 transition-colors hover:text-white">
                  Kontakt
                </a>
              </li>
              <li>
                <a href="#" className="text-emerald-200 transition-colors hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Dla gabinetów</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-emerald-200 transition-colors hover:text-white">
                  Cennik
                </a>
              </li>
              <li>
                <a href="#" className="text-emerald-200 transition-colors hover:text-white">
                  Regulamin
                </a>
              </li>
              <li>
                <a href="#" className="text-emerald-200 transition-colors hover:text-white">
                  Polityka prywatności
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-emerald-800 pt-8 text-center text-sm text-emerald-300">
          © 2026 Vetsy. Z miłości do zwierząt.
        </div>
      </div>
    </footer>
  )
}

export default function HomePageClient() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <ValuePropSection />
        <ClinicsSection />
      </main>
      <Footer />
    </div>
  )
}

