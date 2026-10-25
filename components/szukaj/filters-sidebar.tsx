'use client'

import { StarIcon } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

interface FiltersState {
  categories: string[]
  minRating: number
  priceRange: [number, number]
  facilities: string[]
}

interface FiltersSidebarProps {
  filters: FiltersState
  onFiltersChange: (filters: FiltersState) => void
}

const categories = [
  { id: 'weterynarz', label: 'Weterynarz' },
  { id: 'groomer', label: 'Groomer' },
  { id: 'behawiorysta', label: 'Behawiorysta' },
  { id: 'fizjoterapeuta', label: 'Fizjoterapeuta' },
  { id: 'dietetyk', label: 'Dietetyk zwierzęcy' },
]

const facilities = [
  { id: 'parking', label: 'Parking' },
  { id: 'wizyty-domowe', label: 'Wizyty domowe' },
  { id: '24-7', label: 'Otwarty 24/7' },
  { id: 'przyjazny-kotom', label: 'Przyjazny kotom' },
  { id: 'egzotyczne', label: 'Zwierzęta egzotyczne' },
]

const ratingOptions = [
  { value: 4, label: '4 gwiazdki i więcej' },
  { value: 3, label: '3 gwiazdki i więcej' },
  { value: 2, label: '2 gwiazdki i więcej' },
]

export function FiltersSidebar({ filters, onFiltersChange }: FiltersSidebarProps) {
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter((c) => c !== categoryId)
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handleFacilityChange = (facilityId: string, checked: boolean) => {
    const newFacilities = checked
      ? [...filters.facilities, facilityId]
      : filters.facilities.filter((f) => f !== facilityId)
    onFiltersChange({ ...filters, facilities: newFacilities })
  }

  const handleRatingChange = (rating: number) => {
    onFiltersChange({ ...filters, minRating: filters.minRating === rating ? 0 : rating })
  }

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: [value[0], value[1]] })
  }

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      minRating: 0,
      priceRange: [0, 500],
      facilities: [],
    })
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.minRating > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 500 ||
    filters.facilities.length > 0

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filtry</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-auto p-0 text-sm text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
          >
            Wyczyść
          </Button>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Kategoria</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-3">
              <Checkbox
                id={category.id}
                checked={filters.categories.includes(category.id)}
                onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                className="border-stone-300 data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white"
              />
              <Label htmlFor={category.id} className="text-sm font-normal cursor-pointer">
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Ocena</h3>
        <div className="space-y-3">
          {ratingOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleRatingChange(option.value)}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                filters.minRating === option.value
                  ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200'
                  : 'hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < option.value ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Przedział cenowy</h3>
        <Slider
          value={filters.priceRange}
          onValueChange={handlePriceRangeChange}
          min={0}
          max={500}
          step={10}
          className="py-2 [&_[data-slot=slider-range]]:bg-emerald-600 [&_[data-slot=slider-thumb]]:border-emerald-600"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{filters.priceRange[0]} zł</span>
          <span>{filters.priceRange[1]} zł</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Udogodnienia</h3>
        <div className="space-y-3">
          {facilities.map((facility) => (
            <div key={facility.id} className="flex items-center gap-3">
              <Checkbox
                id={facility.id}
                checked={filters.facilities.includes(facility.id)}
                onCheckedChange={(checked) => handleFacilityChange(facility.id, checked as boolean)}
                className="border-stone-300 data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white"
              />
              <Label htmlFor={facility.id} className="text-sm font-normal cursor-pointer">
                {facility.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
