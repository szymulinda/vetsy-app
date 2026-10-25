'use client'

import Image from 'next/image'
import { MapPin, Star } from 'lucide-react'

const DEFAULT_HERO =
  'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=1600&h=400&fit=crop&q=80'

function brandInitial(name: string) {
  const m = name.trim().match(/\p{L}/u)
  return m ? m[0].toUpperCase() : '?'
}

export type ClinicHeaderProps = {
  name: string
  address: string
  city: string
  phone: string
  logoUrl: string | null
}

export function ClinicHeader({
  name,
  address,
  city,
  phone,
  logoUrl,
}: ClinicHeaderProps) {
  const line = `${address}, ${city}`
  const logo = logoUrl?.trim() || null

  return (
    <div className="relative">
      <div className="relative h-64 w-full overflow-hidden md:h-72">
        <Image
          src={DEFAULT_HERO}
          alt={name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 -mt-16 rounded-2xl bg-white p-6 shadow-lg md:-mt-20 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4 md:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-emerald-50 md:h-24 md:w-24">
                {logo ? (
                  <Image
                    src={logo}
                    alt="Logo kliniki"
                    width={64}
                    height={64}
                    className="h-14 w-14 md:h-16 md:w-16"
                  />
                ) : (
                  <span className="text-2xl font-bold text-emerald-700 md:text-3xl" aria-hidden>
                    {brandInitial(name)}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-900 md:text-2xl">
                  {name}
                </h1>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center gap-1 text-stone-600">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm">{line}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= 4
                              ? 'fill-amber-400 text-amber-400'
                              : star === 5
                                ? 'fill-amber-400/80 text-amber-400'
                                : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-stone-700">—</span>
                    <span className="text-sm text-stone-500">brak ocen</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="rounded-lg bg-emerald-50 px-4 py-2 text-center">
                <p className="text-xs text-emerald-600">Dostępne terminy</p>
                <p className="font-bold text-emerald-700">Dzisiaj</p>
              </div>
              <div className="rounded-lg bg-stone-50 px-4 py-2 text-center">
                <p className="text-xs text-stone-500">Godziny otwarcia</p>
                <p className="font-medium text-stone-700">8:00 - 20:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
