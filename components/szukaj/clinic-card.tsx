'use client'

import Image from 'next/image'
import Link from 'next/link'
import { StarIcon, MapPinIcon, HeartIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export interface Clinic {
  id: string
  name: string
  image: string
  logoUrl?: string | null
  categories: string[]
  address: string
  distance: string
  rating: number
  reviewCount: number
  services: string[]
  priceFrom: number
  lat?: number | null
  lng?: number | null
}

interface ClinicCardProps {
  clinic: Clinic
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
}

export function ClinicCard({ clinic, isFavorite, onToggleFavorite }: ClinicCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md sm:flex-row">
      <div className="relative aspect-[4/3] w-full shrink-0 sm:aspect-square sm:w-48 lg:w-56">
        <Image
          src={clinic.image}
          alt={clinic.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <button
          onClick={() => onToggleFavorite(clinic.id)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition-colors hover:bg-background"
          aria-label={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
        >
          <HeartIcon
            className={`h-4 w-4 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
            }`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {clinic.categories.map((category) => (
            <Badge key={category} variant="secondary" className="text-xs font-medium">
              {category}
            </Badge>
          ))}
        </div>

        <h3 className="mb-1 text-lg font-semibold leading-tight text-balance">
          {clinic.name}
        </h3>

        <div className="mb-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{clinic.address}</span>
          <span className="shrink-0 font-medium text-emerald-700">• {clinic.distance}</span>
        </div>

        <div className="mb-3 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(clinic.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : i < clinic.rating
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'text-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{clinic.rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({clinic.reviewCount} opinii)</span>
        </div>

        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {clinic.services.join(', ')}
        </p>

        <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm">
            <span className="text-muted-foreground">od </span>
            <span className="text-lg font-semibold">{clinic.priceFrom} zł</span>
          </div>
          <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto" asChild>
            <Link href={`/gabinet/${clinic.id}`}>Zobacz profil i umów się</Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
