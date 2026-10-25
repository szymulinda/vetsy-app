"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { createAppointment } from "@/app/dashboard/[clinicId]/actions"

const timeSlots = [
  "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
]

const weekDays = [
  { short: "Pon", full: "Poniedziałek", date: "6" },
  { short: "Wt", full: "Wtorek", date: "7" },
  { short: "Śr", full: "Środa", date: "8" },
  { short: "Czw", full: "Czwartek", date: "9" },
  { short: "Pt", full: "Piątek", date: "10" },
  { short: "Sob", full: "Sobota", date: "11" },
  { short: "Nd", full: "Niedziela", date: "12" },
]

interface Appointment {
  id: string
  title: string
  pet: string
  day: number
  startTime: string
  duration: number
  status: "confirmed" | "pending" | "completed"
}

const statusStyles = {
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  completed: "bg-stone-200 text-stone-800 border-stone-300",
}

export function CalendarView({ appointments, clinicId }: { appointments: Appointment[]; clinicId: string }) {
  const getTimeIndex = (time: string) => timeSlots.indexOf(time)
  const [open, setOpen] = useState(false)
  const [clientId, setClientId] = useState("")
  const [petId, setPetId] = useState("")
  const [serviceId, setServiceId] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [status, setStatus] = useState("pending")
  const [isPending, startTransition] = useTransition()

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-xl">
            <ChevronLeft className="size-4" />
          </Button>
          <div className="px-4 py-2 bg-white border border-stone-200 rounded-xl">
            <span className="text-sm font-medium text-stone-700">Maj 2026</span>
          </div>
          <Button variant="outline" size="icon" className="rounded-xl">
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Dodaj wizytę
        </Button>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-emerald-500" />
          <span className="text-stone-600">Potwierdzona</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-amber-500" />
          <span className="text-stone-600">Oczekująca</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-stone-400" />
          <span className="text-stone-600">Zakończona</span>
        </div>
      </div>

      <Card className="rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-stone-100">
              <div className="p-4 bg-stone-50" />
              {weekDays.map((day, index) => (
                <div
                  key={day.short}
                  className={cn(
                    "p-4 text-center border-l border-stone-100",
                    index === 2 && "bg-emerald-50"
                  )}
                >
                  <p className="text-xs text-stone-500 uppercase tracking-wide">{day.short}</p>
                  <p className={cn(
                    "text-lg font-semibold mt-1",
                    index === 2 ? "text-emerald-700" : "text-stone-900"
                  )}>
                    {day.date}
                  </p>
                </div>
              ))}
            </div>

            <div className="relative">
              {timeSlots.map((time, timeIndex) => (
                <div key={time} className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-stone-50">
                  <div className="p-2 text-right pr-4">
                    <span className="text-xs text-stone-400">{time}</span>
                  </div>
                  {weekDays.map((day, dayIndex) => (
                    <div
                      key={`${day.short}-${time}`}
                      className={cn(
                        "border-l border-stone-50 h-14 relative",
                        dayIndex === 2 && "bg-emerald-50/30"
                      )}
                    >
                      {appointments
                        .filter(
                          (apt) =>
                            apt.day === dayIndex && getTimeIndex(apt.startTime) === timeIndex
                        )
                        .map((apt) => (
                          <div
                            key={apt.id}
                            className={cn(
                              "absolute left-1 right-1 top-1 rounded-xl border p-2 cursor-pointer transition-shadow hover:shadow-md z-10",
                              statusStyles[apt.status]
                            )}
                            style={{ height: `${apt.duration * 56 - 8}px` }}
                          >
                            <p className="text-xs font-semibold truncate">
                              {apt.title}
                            </p>
                            <p className="text-xs opacity-75 truncate">
                              {apt.pet}
                            </p>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-stone-900">Dodaj wizytę</p>
                <p className="mt-1 text-sm text-stone-500">Utworzy rekord w tabeli appointments.</p>
              </div>
              <Button variant="ghost" size="icon-sm" className="rounded-xl" onClick={() => setOpen(false)}>
                ✕
              </Button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-stone-700 text-sm font-medium">Client ID</label>
                <Input value={clientId} onChange={(e) => setClientId(e.target.value)} className="rounded-xl border-stone-200 focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-stone-700 text-sm font-medium">Pet ID</label>
                  <Input value={petId} onChange={(e) => setPetId(e.target.value)} className="rounded-xl border-stone-200 focus:border-emerald-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-stone-700 text-sm font-medium">Service ID</label>
                  <Input value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="rounded-xl border-stone-200 focus:border-emerald-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-stone-700 text-sm font-medium">Start (ISO)</label>
                  <Input value={startTime} onChange={(e) => setStartTime(e.target.value)} className="rounded-xl border-stone-200 focus:border-emerald-500" />
                </div>
                <div className="space-y-2">
                  <label className="text-stone-700 text-sm font-medium">Koniec (ISO)</label>
                  <Input value={endTime} onChange={(e) => setEndTime(e.target.value)} className="rounded-xl border-stone-200 focus:border-emerald-500" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-stone-700 text-sm font-medium">Status</label>
                <Input value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border-stone-200 focus:border-emerald-500" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
                  Anuluj
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                  disabled={isPending}
                  onClick={() => {
                    if (!clientId.trim() || !petId.trim() || !serviceId.trim() || !startTime.trim() || !endTime.trim()) {
                      toast.error("Uzupełnij wszystkie pola.")
                      return
                    }
                    startTransition(async () => {
                      const res = await createAppointment(clinicId, {
                        clientId: clientId.trim(),
                        petId: petId.trim(),
                        serviceId: serviceId.trim(),
                        startTime: startTime.trim(),
                        endTime: endTime.trim(),
                        status: status.trim() || "pending",
                      })
                      if (res.ok) {
                        toast.success("Dodano wizytę.")
                        setOpen(false)
                        setClientId("")
                        setPetId("")
                        setServiceId("")
                        setStartTime("")
                        setEndTime("")
                        setStatus("pending")
                      } else {
                        toast.error(res.error || "Nie udało się dodać wizyty.")
                      }
                    })
                  }}
                >
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
