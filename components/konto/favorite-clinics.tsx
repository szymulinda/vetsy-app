import { MapPin, Star, ChevronRight, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Clinic {
  id: string
  name: string
  address: string
  rating: number
  reviewCount: number
  image?: string
}

const favoriteClinics: Clinic[] = [
  {
    id: "1",
    name: "Przychodnia Weterynaryjna Zdrowy Pupil",
    address: "ul. Kwiatowa 15, Warszawa",
    rating: 4.9,
    reviewCount: 127,
  },
  {
    id: "2",
    name: "VetCare Centrum",
    address: "ul. Polna 8, Warszawa",
    rating: 4.8,
    reviewCount: 89,
  },
  {
    id: "3",
    name: "Pet Spa & Grooming",
    address: "ul. Parkowa 22, Warszawa",
    rating: 4.7,
    reviewCount: 64,
  },
]

function ClinicCard({ clinic }: { clinic: Clinic }) {
  return (
    <div className="group flex min-w-[280px] flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200/50 transition-all duration-300 hover:shadow-md hover:ring-emerald-200 sm:min-w-[320px]">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-stone-800 truncate pr-2">{clinic.name}</h4>
          <p className="mt-1 flex items-center gap-1 text-sm text-stone-500">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{clinic.address}</span>
          </p>
        </div>
        <button
          type="button"
          className="flex-shrink-0 rounded-full p-1.5 text-rose-400 transition-colors hover:bg-rose-50"
          aria-label="Usuń z ulubionych"
        >
          <Heart className="h-4 w-4 fill-current" />
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-amber-700">{clinic.rating}</span>
        </div>
        <span className="text-xs text-stone-500">({clinic.reviewCount} opinii)</span>
      </div>
      <Button
        className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700"
        size="sm"
      >
        Zarezerwuj wizytę
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  )
}

export function FavoriteClinics() {
  return (
    <section className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-stone-800 sm:text-2xl">
            Ulubione gabinety
          </h2>
          <Button
            variant="ghost"
            className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
          >
            Zobacz wszystkie
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {favoriteClinics.map((clinic) => (
            <ClinicCard key={clinic.id} clinic={clinic} />
          ))}
        </div>
      </div>
    </section>
  )
}
