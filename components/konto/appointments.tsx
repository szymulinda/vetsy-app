"use client"

import { useMemo, useState, useTransition } from "react"
import {
  Calendar,
  MapPin,
  CalendarClock,
  PawPrint,
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { pl } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { cancelAppointment, rescheduleAppointment } from "@/app/konto/actions"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Appointment = {
  id: string
  start_time: string
  status: string
  clinic: { name: string; address: string; city: string } | null
  pet: { name: string } | null
  service: { name: string } | null
}

function formatPolishDateTime(iso: string) {
  const d = parseISO(iso)
  const date = format(d, "d MMMM yyyy", { locale: pl })
  const time = format(d, "HH:mm", { locale: pl })
  return { date, time }
}

function AppointmentCard({
  appointment,
  isUpcoming,
}: {
  appointment: Appointment
  isUpcoming: boolean
}) {
  const { date, time } = formatPolishDateTime(appointment.start_time)
  const initialIso = useMemo(() => appointment.start_time, [appointment.start_time])
  const clinicName = appointment.clinic?.name ?? "Gabinet"
  const address = [appointment.clinic?.address, appointment.clinic?.city].filter(Boolean).join(", ")
  const petName = appointment.pet?.name ?? "Pupil"
  const serviceName = appointment.service?.name ?? ""
  const [isPending, startTransition] = useTransition()
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false)
  const [newDate, setNewDate] = useState(() => {
    const d = parseISO(initialIso)
    return Number.isNaN(d.getTime()) ? "" : format(d, "yyyy-MM-dd", { locale: pl })
  })
  const [newTime, setNewTime] = useState(() => {
    const d = parseISO(initialIso)
    return Number.isNaN(d.getTime()) ? "" : format(d, "HH:mm", { locale: pl })
  })

  return (
    <div
      className={cn(
        "group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/60 transition-all duration-300 hover:shadow-md",
        isUpcoming && "hover:ring-emerald-200"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div
            className={cn(
              "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl",
              isUpcoming
                ? "bg-emerald-100 text-emerald-600"
                : "bg-stone-100 text-stone-500"
            )}
          >
            <CalendarClock className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                  isUpcoming
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-stone-100 text-stone-600"
                )}
              >
                <Calendar className="h-3 w-3" />
                {date}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                  isUpcoming
                    ? "bg-amber-100 text-amber-700"
                    : "bg-stone-100 text-stone-600"
                )}
              >
                <CalendarClock className="h-3 w-3" />
                {time}
              </span>
            </div>
            <h4 className="mt-2 font-semibold text-stone-800 text-pretty">
              {clinicName}
            </h4>
            <p className="mt-1 flex items-start gap-1.5 text-sm text-stone-500">
              <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              {address}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-sm text-stone-600">
                <PawPrint className="h-4 w-4 text-emerald-500" />
                Dla: <span className="font-medium">{petName}</span>
              </span>
              <span className="text-stone-300">|</span>
              <span className="text-sm text-stone-600">{serviceName}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
          {isUpcoming ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-stone-200 text-stone-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                onClick={() => setIsRescheduleOpen(true)}
              >
                Zmień termin
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={isPending}
                className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-60"
                onClick={() => {
                  startTransition(async () => {
                    toast.success("Wizyta została odwołana")
                    const res = await cancelAppointment(appointment.id)
                    if (!res.ok) toast.error(res.error ?? "Nie udało się odwołać wizyty")
                  })
                }}
              >
                Odwołaj wizytę
              </Button>
            </>
          ) : (
            <div />
          )}
        </div>
      </div>

      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Zmień termin wizyty</DialogTitle>
            <DialogDescription>Wybierz nową datę i godzinę wizyty.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-stone-700">Data</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-900 shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-stone-700">Godzina</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-900 shadow-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-stone-200 text-stone-700 hover:bg-stone-50"
              onClick={() => setIsRescheduleOpen(false)}
              disabled={isPending}
            >
              Anuluj
            </Button>
            <Button
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  const res = await rescheduleAppointment(appointment.id, newDate, newTime)
                  if (res.ok) {
                    toast.success("Termin wizyty został zmieniony")
                    setIsRescheduleOpen(false)
                  } else {
                    toast.error(res.error ?? "Nie udało się zmienić terminu")
                  }
                })
              }}
            >
              Zatwierdź zmianę
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function Appointments({ appointments }: { appointments: Appointment[] }) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming")
  const now = useMemo(() => new Date(), [activeTab, appointments.length])

  const upcomingAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const start = parseISO(a.start_time)
      const isFuture = start.getTime() > now.getTime()
      const isCancelled = a.status === "odwolana"
      return (isFuture && !isCancelled) || (!Number.isFinite(start.getTime()) && !isCancelled)
    })
  }, [appointments, now])

  const historyAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const start = parseISO(a.start_time)
      const isPast = start.getTime() < now.getTime()
      const isCancelled = a.status === "odwolana"
      return isPast || isCancelled
    })
  }, [appointments, now])

  const displayedAppointments = activeTab === "upcoming" ? upcomingAppointments : historyAppointments

  return (
    <section id="wizyty" className="bg-stone-100/50 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-stone-800 sm:text-2xl">
            Twoje rezerwacje
          </h2>
          <div className="flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-stone-200/50">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={cn(
                "relative rounded-lg px-4 py-2 text-sm font-medium transition-all",
                activeTab === "upcoming"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-800"
              )}
            >
              Nadchodzące
              {upcomingAppointments.length > 0 && (
                <span
                  className={cn(
                    "ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs",
                    activeTab === "upcoming"
                      ? "bg-emerald-500 text-white"
                      : "bg-emerald-100 text-emerald-700"
                  )}
                >
                  {upcomingAppointments.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={cn(
                "relative rounded-lg px-4 py-2 text-sm font-medium transition-all",
                activeTab === "history"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-800"
              )}
            >
              Historia
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {displayedAppointments.length > 0 ? (
            displayedAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                isUpcoming={activeTab === "upcoming"}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
                <Calendar className="h-8 w-8 text-stone-400" />
              </div>
              <p className="mt-4 text-stone-600">
                Nie masz jeszcze zaplanowanych wizyt
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
