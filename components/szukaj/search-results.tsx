'use client'

import { useState } from 'react'
import { MapIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ClinicCard, type Clinic } from '@/components/szukaj/clinic-card'
import { FiltersSidebar } from '@/components/szukaj/filters-sidebar'
import { MobileFilters } from '@/components/szukaj/mobile-filters'
import Map from '@/components/map/clinic-map'

interface FiltersState {
  categories: string[]
  minRating: number
  priceRange: [number, number]
  facilities: string[]
}

export type SearchResultsProps = {
  clinics: Clinic[]
  query: string
  city: string
}

export function SearchResults({ clinics, query, city }: SearchResultsProps) {
  const [sortBy, setSortBy] = useState('rating')
  const [showMap, setShowMap] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [filters, setFilters] = useState<FiltersState>({
    categories: [],
    minRating: 0,
    priceRange: [0, 500],
    facilities: [],
  })

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  const activeFiltersCount =
    filters.categories.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 500 ? 1 : 0) +
    filters.facilities.length

  const sortedClinics = [...clinics].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'price-low':
        return a.priceFrom - b.priceFrom
      case 'price-high':
        return b.priceFrom - a.priceFrom
      case 'distance': {
        const da = parseFloat(String(a.distance).replace(/[^\d.]/g, '')) || 0
        const db = parseFloat(String(b.distance).replace(/[^\d.]/g, '')) || 0
        return da - db
      }
      case 'reviews':
        return b.reviewCount - a.reviewCount
      default:
        return 0
    }
  })

  const subtitleParts = [query.trim(), city.trim()].filter(Boolean)
  const subtitle =
    subtitleParts.length > 0 ? subtitleParts.join(' • ') : 'Wszystkie lokalizacje'

  const mappable = showMap
    ? clinics
        .filter((c) => typeof c.lat === 'number' && typeof c.lng === 'number')
        .map((c) => ({
          id: c.id,
          name: c.name,
          address: c.address,
          lat: c.lat as number,
          lng: c.lng as number,
          logo_url: c.logoUrl ?? null,
        }))
    : []

  if (clinics.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-lg text-muted-foreground">
          Nie znaleziono specjalistów w Twojej okolicy
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex gap-8">
        <div className="hidden w-64 shrink-0 lg:block">
          <FiltersSidebar filters={filters} onFiltersChange={setFilters} />
        </div>

        <div className="flex-1">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-balance text-xl font-semibold sm:text-2xl">
                Znaleziono {clinics.length}{' '}
                {clinics.length === 1 ? 'specjalistę' : 'specjalistów'}
                {city.trim() ? ` w ${city.trim()}` : ''}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            </div>

            <div className="flex items-center gap-3">
              <MobileFilters
                filters={filters}
                onFiltersChange={setFilters}
                activeFiltersCount={activeFiltersCount}
              />

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] border-stone-300 focus:ring-emerald-500 data-[placeholder]:text-stone-500">
                  <SelectValue placeholder="Sortuj według" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Najlepsze oceny</SelectItem>
                  <SelectItem value="reviews">Najwięcej opinii</SelectItem>
                  <SelectItem value="price-low">Najniższa cena</SelectItem>
                  <SelectItem value="price-high">Najwyższa cena</SelectItem>
                  <SelectItem value="distance">Najbliżej</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={showMap ? 'default' : 'outline'}
                size="sm"
                type="button"
                onClick={() => setShowMap(!showMap)}
                className={
                  showMap
                    ? 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'border-stone-300 text-stone-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800'
                }
              >
                <MapIcon className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {showMap ? 'Ukryj mapę' : 'Pokaż mapę'}
                </span>
              </Button>
            </div>
          </div>

          {showMap && (
            <div className="mb-6 overflow-hidden rounded-xl border">
              <Map clinics={mappable} />
            </div>
          )}

          <div className="space-y-4">
            {sortedClinics.map((clinic) => (
              <ClinicCard
                key={clinic.id}
                clinic={clinic}
                isFavorite={favorites.includes(clinic.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
