"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Phone, Mail, Dog, Cat, Bird } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { createPet } from "@/app/dashboard/[clinicId]/actions"

interface Patient {
  id: string
  clientName: string
  petName: string
  species: "Pies" | "Kot" | "Ptak"
  phone: string
  email: string
  weightKg?: number | null
  age?: number | null
  breed?: string | null
}

const speciesIcons = {
  Pies: Dog,
  Kot: Cat,
  Ptak: Bird,
}

const speciesColors = {
  Pies: "bg-amber-100 text-amber-700",
  Kot: "bg-purple-100 text-purple-700",
  Ptak: "bg-sky-100 text-sky-700",
}

export function PatientsView({ patients }: { patients: Patient[] }) {
  const [open, setOpen] = useState(false)
  const [ownerId, setOwnerId] = useState("")
  const [petName, setPetName] = useState("")
  const [species, setSpecies] = useState("Pies")
  const [isPending, startTransition] = useTransition()

  const onCreate = () => {
    if (!ownerId.trim() || !petName.trim() || !species.trim()) {
      toast.error("Uzupełnij ID właściciela, imię i gatunek.")
      return
    }
    startTransition(async () => {
      const res = await createPet({
        ownerId: ownerId.trim(),
        name: petName.trim(),
        species: species.trim(),
      })
      if (res.ok) {
        toast.success("Dodano pacjenta.")
        setOpen(false)
        setOwnerId("")
        setPetName("")
        setSpecies("Pies")
      } else {
        toast.error(res.error || "Nie udało się dodać pacjenta.")
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
          <Input
            placeholder="Szukaj klienta lub zwierzęcia..."
            className="pl-10 rounded-xl border-stone-200 focus:border-emerald-500"
          />
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Dodaj pacjenta
        </Button>
      </div>

      {patients.length === 0 ? (
        <Card className="rounded-2xl p-8 text-center text-stone-600 shadow-sm">
          <p className="text-lg font-semibold text-stone-800">Brak pacjentów</p>
          <p className="mt-2 text-sm text-stone-500">Gdy pojawią się wizyty w tej klinice, zobaczysz tu listę pacjentów.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patients.map((patient) => {
            const SpeciesIcon = speciesIcons[patient.species]
            const meta: string[] = []
            if (typeof patient.weightKg === "number") meta.push(`Waga: ${patient.weightKg} kg`)
            if (typeof patient.age === "number") meta.push(`Wiek: ${patient.age}`)
            if (patient.breed) meta.push(`Rasa: ${patient.breed}`)
            return (
              <Card
                key={patient.id}
                className="rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "flex items-center justify-center size-12 rounded-xl shrink-0",
                    speciesColors[patient.species]
                  )}>
                    <SpeciesIcon className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-stone-900 truncate">{patient.clientName}</h3>
                    <p className="text-sm text-emerald-600 font-medium">
                      {patient.petName} ({patient.species})
                    </p>
                    {meta.length > 0 ? (
                      <p className="mt-1 text-sm text-gray-500">
                        {meta.join(" • ")}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Phone className="size-4 text-stone-400" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Mail className="size-4 text-stone-400" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-stone-900">Dodaj pacjenta</p>
                <p className="mt-1 text-sm text-stone-500">Utworzy rekord w tabeli pets.</p>
              </div>
              <Button variant="ghost" size="icon-sm" className="rounded-xl" onClick={() => setOpen(false)}>
                ✕
              </Button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-stone-700 text-sm font-medium">ID właściciela (profiles.id)</label>
                <Input
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  className="rounded-xl border-stone-200 focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-stone-700 text-sm font-medium">Imię zwierzaka</label>
                  <Input
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="rounded-xl border-stone-200 focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-stone-700 text-sm font-medium">Gatunek</label>
                  <Input
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="rounded-xl border-stone-200 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
                  Anuluj
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl" onClick={onCreate} disabled={isPending}>
                  Dodaj
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
