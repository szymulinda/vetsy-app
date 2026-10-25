'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Map as PigeonMap, Overlay } from 'pigeon-maps'
import { PawPrint, X } from 'lucide-react'

export type MapClinic = {
  id: string
  name: string
  address: string
  lat: number | null
  lng: number | null
  email?: string | null
}

export default function Map({ clinics }: { clinics: MapClinic[] }) {
  const [activeClinic, setActiveClinic] = useState<MapClinic | null>(null)
  const validClinics = useMemo(() => clinics?.filter((c) => c.lat && c.lng) || [], [clinics])
  const provider = useMemo(() => {
    const subdomains = ['a', 'b', 'c', 'd']
    return (x: number, y: number, z: number, dpr?: number) => {
      const r = dpr && dpr >= 2 ? '@2x' : ''
      const s = subdomains[Math.abs(x + y) % subdomains.length]
      return `https://${s}.basemaps.cartocdn.com/light_all/${z}/${x}/${y}${r}.png`
    }
  }, [])

  const center = useMemo(() => {
    if (validClinics.length === 0) return [51.9194, 19.1451] as [number, number]
    const pts = validClinics.map((c) => [c.lat as number, c.lng as number] as [number, number])
    const avgLat = pts.reduce((s, p) => s + p[0], 0) / pts.length
    const avgLng = pts.reduce((s, p) => s + p[1], 0) / pts.length
    return [avgLat, avgLng] as [number, number]
  }, [validClinics])

  return (
    <div className="h-64 w-full bg-[#F5F5DC] border-l border-green-200">
      <PigeonMap
        defaultCenter={center}
        defaultZoom={6}
        provider={provider}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        animate={false}
        drag
        mouseEvents
        touchEvents={false}
        wheelEvents={false}
        twoFingerDrag={false}
      >
        {validClinics.length === 0 ? (
          <Overlay anchor={center} offset={[0, 0]}>
            <div className="rounded-xl bg-white/90 px-4 py-2 text-sm text-stone-600 shadow-sm border border-stone-200">
              Brak punktów do wyświetlenia
            </div>
          </Overlay>
        ) : null}
        {validClinics.map((clinic) => (
          <Overlay key={clinic.id} anchor={[clinic.lat as number, clinic.lng as number]} offset={[20, 40]}>
            <button
              type="button"
              onClick={() => setActiveClinic(clinic)}
              className="bg-[#B2D2A4] rounded-full w-10 h-10 flex items-center justify-center shadow-xl border-2 border-white text-white hover:scale-105 transition-transform duration-300"
            >
              <PawPrint size={20} />
            </button>
          </Overlay>
        ))}

        {activeClinic ? (
          <Overlay anchor={[activeClinic.lat as number, activeClinic.lng as number]} offset={[100, 100]}>
            <div className="relative bg-white shadow-xl rounded-xl p-4 z-50 min-w-[240px]">
              <button
                type="button"
                onClick={() => setActiveClinic(null)}
                className="absolute right-2 top-2 rounded-md p-1 text-stone-500 hover:bg-stone-100"
                aria-label="Zamknij"
              >
                <X size={16} />
              </button>
              <p className="text-sm font-semibold text-stone-900 pr-6">{activeClinic.name}</p>
              <p className="mt-1 text-xs text-stone-600">{activeClinic.address}</p>
              {activeClinic.email?.trim() ? (
                <p className="mt-2 text-xs text-stone-600">{activeClinic.email.trim()}</p>
              ) : null}
              <Link
                href={`/gabinet/${activeClinic.id}`}
                className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Zobacz profil
              </Link>
            </div>
          </Overlay>
        ) : null}
      </PigeonMap>
    </div>
  )
}
