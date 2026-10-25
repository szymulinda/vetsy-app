"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface HeaderProps {
  title: string
}

const tabTitles: Record<string, string> = {
  kalendarz: "Kalendarz",
  uslugi: "Usługi",
  pacjenci: "Pacjenci",
  ustawienia: "Ustawienia",
}

export function DashboardHeader({ title }: HeaderProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-8 bg-amber-100 rounded-full">
            <Sparkles className="size-4 text-amber-600" />
          </div>
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Okres próbny:</span> Zostało Ci 24 dni pełnego dostępu.
          </p>
        </div>
        <Button 
          size="sm" 
          className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
        >
          Opłać subskrypcję
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-stone-900">
        {tabTitles[title] || title}
      </h1>
    </div>
  )
}
