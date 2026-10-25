'use client'

import { SlidersHorizontalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { FiltersSidebar } from '@/components/szukaj/filters-sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'

interface FiltersState {
  categories: string[]
  minRating: number
  priceRange: [number, number]
  facilities: string[]
}

interface MobileFiltersProps {
  filters: FiltersState
  onFiltersChange: (filters: FiltersState) => void
  activeFiltersCount: number
}

export function MobileFilters({ filters, onFiltersChange, activeFiltersCount }: MobileFiltersProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative border-stone-300 text-stone-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 lg:hidden"
        >
          <SlidersHorizontalIcon className="h-4 w-4" />
          <span>Filtry</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-sm p-0">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>Filtry</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="p-6">
            <FiltersSidebar filters={filters} onFiltersChange={onFiltersChange} />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
