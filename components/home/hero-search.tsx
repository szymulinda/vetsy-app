"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"

export function HeroSearch() {
  const router = useRouter()
  const [q, setQ] = useState("")
  const [city, setCity] = useState("")

  const submit = () => {
    const p = new URLSearchParams()
    const qt = q.trim()
    const ct = city.trim()
    if (qt) p.set("query", qt)
    if (ct) p.set("city", ct)
    const qs = p.toString()
    router.push(qs ? `/szukaj?${qs}` : "/szukaj")
  }

  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <form
        className="flex flex-col items-stretch gap-2 rounded-full bg-white p-2 shadow-xl sm:flex-row sm:items-center"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <div className="flex flex-1 items-center gap-3 border-b border-stone-100 px-4 py-2 sm:border-b-0 sm:border-r sm:py-2">
          <Search className="h-5 w-5 shrink-0 text-stone-400" />
          <Input
            type="text"
            name="query"
            placeholder="Kogo szukasz? (np. Weterynarz)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-auto border-0 p-0 text-stone-700 shadow-none placeholder:text-stone-400 focus-visible:ring-0"
          />
        </div>
        <div className="flex flex-1 items-center gap-3 px-4 py-2 sm:py-2">
          <MapPin className="h-5 w-5 shrink-0 text-stone-400" />
          <Input
            type="text"
            name="city"
            placeholder="Gdzie? (Miasto)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-auto border-0 p-0 text-stone-700 shadow-none placeholder:text-stone-400 focus-visible:ring-0"
          />
        </div>
        <Button
          type="submit"
          className="shrink-0 rounded-full bg-emerald-600 px-8 py-6 text-base font-semibold text-white hover:bg-emerald-700"
        >
          Szukaj
        </Button>
      </form>
    </div>
  )
}
