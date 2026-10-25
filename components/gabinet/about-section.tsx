'use client'

import Image from 'next/image'
import { MapPin, Phone, BadgeCheck, Calendar, Stethoscope } from 'lucide-react'
import type { Database } from '@/lib/supabase/database.types'

type ClinicAbout = Pick<
  Database['public']['Tables']['clinics']['Row'],
  | 'name'
  | 'description'
  | 'address'
  | 'city'
  | 'phone'
  | 'created_at'
  | 'is_verified'
>

type ClinicPhotoRow = Pick<
  Database['public']['Tables']['clinic_photos']['Row'],
  'id' | 'url' | 'description'
>

export function AboutSection({
  clinic,
  serviceCount,
  photos,
}: {
  clinic: ClinicAbout
  serviceCount: number
  photos: ClinicPhotoRow[]
}) {
  const body =
    clinic.description?.trim() ||
    'Ten gabinet nie dodał jeszcze opisu. Skontaktuj się bezpośrednio, aby poznać ofertę i zespół.'

  const sinceYear = clinic.created_at
    ? new Date(clinic.created_at).getFullYear()
    : null

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-stone-800">O naszej klinice</h2>
        <div className="space-y-4 leading-relaxed text-stone-600">
          {body.split(/\n\n+/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg border border-stone-100 bg-stone-50/80 p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Adres</p>
              <p className="font-medium text-stone-800">{clinic.address}, {clinic.city}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-stone-100 bg-stone-50/80 p-4">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Telefon</p>
              {clinic.phone?.trim() ? (
                <a
                  href={`tel:${clinic.phone.replace(/\s/g, '')}`}
                  className="font-medium text-emerald-700 hover:underline"
                >
                  {clinic.phone}
                </a>
              ) : (
                <p className="font-medium text-stone-800">Do uzupełnienia</p>
              )}
            </div>
          </div>
          {sinceYear ? (
            <div className="flex items-start gap-3 rounded-lg border border-stone-100 bg-stone-50/80 p-4">
              <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-stone-500">W serwisie od</p>
                <p className="font-medium text-stone-800">{sinceYear}</p>
              </div>
            </div>
          ) : null}
          <div className="flex items-start gap-3 rounded-lg border border-stone-100 bg-stone-50/80 p-4">
            <Stethoscope className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Usługi w cenniku</p>
              <p className="font-medium text-stone-800">{serviceCount}</p>
            </div>
          </div>
          {clinic.is_verified ? (
            <div className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50/80 p-4 sm:col-span-2">
              <BadgeCheck className="h-6 w-6 shrink-0 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-900">Gabinet zweryfikowany w Vetsy</p>
            </div>
          ) : null}
        </div>

        <div className="mt-8 border-t border-stone-100 pt-8">
          <h3 className="mb-4 text-base font-bold text-stone-800">Galeria zdjęć</h3>
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={photo.url}
                    alt={photo.description?.trim() || clinic.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">
              Klinika pracuje nad uzupełnieniem swojej galerii. Zdjęcia pojawią się tu wkrótce!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
