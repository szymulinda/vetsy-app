'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SearchIcon, MapPinIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type SearchBarProps = {
  defaultQuery?: string
  defaultCity?: string
}

export function SearchBar({ defaultQuery = '', defaultCity = '' }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultQuery)
  const [location, setLocation] = useState(defaultCity)

  useEffect(() => {
    setQuery(defaultQuery)
    setLocation(defaultCity)
  }, [defaultQuery, defaultCity])

  const submit = () => {
    const p = new URLSearchParams()
    const qt = query.trim()
    const ct = location.trim()
    if (qt) p.set('query', qt)
    if (ct) p.set('city', ct)
    const qs = p.toString()
    router.push(qs ? `/szukaj?${qs}` : '/szukaj')
  }

  return (
    <div className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <form
        className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Czego szukasz?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative flex-1">
          <MapPinIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Lokalizacja"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          type="submit"
          className="bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Szukaj
        </Button>
      </form>
    </div>
  )
}
