'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ClinicHeader } from '@/components/gabinet/clinic-header'
import { ServicesList } from '@/components/gabinet/services-list'
import { AboutSection } from '@/components/gabinet/about-section'
import { ReviewsSection } from '@/components/gabinet/reviews-section'
import { MobileBookingDrawer } from '@/components/gabinet/mobile-booking-drawer'
import { toast } from 'sonner'
import { addPetAction, bookAppointment } from '@/app/gabinet/actions'
import type { Database } from '@/lib/supabase/database.types'
import type { ClinicServiceUi } from '@/lib/gabinet/map-clinic-services'
import type { ClinicReviewUi } from '@/lib/gabinet/map-reviews'
import { isWithinInterval } from 'date-fns'

type ClinicRow = Database['public']['Tables']['clinics']['Row']

type ClinicPhotoPick = Pick<
  Database['public']['Tables']['clinic_photos']['Row'],
  'id' | 'url' | 'description'
>

type PetPick = Pick<
  Database['public']['Tables']['pets']['Row'],
  'id' | 'name' | 'species'
>

type BusyAppointmentPick = Pick<
  Database['public']['Tables']['appointments']['Row'],
  'start_time' | 'end_time'
>

type BookState = {
  ok: boolean
  error?: string
}

type AddPetState = {
  ok: boolean
  petId?: string
  error?: string
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
]

export function ClinicProfileView({
  clinic,
  services,
  reviews,
  photos,
  pets,
  isLoggedIn,
  canReview,
  busyAppointments,
}: {
  clinic: ClinicRow
  services: ClinicServiceUi[]
  reviews: ClinicReviewUi[]
  photos: ClinicPhotoPick[]
  pets: PetPick[]
  isLoggedIn: boolean
  canReview: boolean
  busyAppointments: BusyAppointmentPick[]
}) {
  const router = useRouter()
  const [selectedService, setSelectedService] = useState<ClinicServiceUi | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedPet, setSelectedPet] = useState<string>('')
  const [showAddPet, setShowAddPet] = useState(false)
  const [newPetSpecies, setNewPetSpecies] = useState<string>('')

  const isBookingComplete = Boolean(selectedService && selectedDate && selectedTime && selectedPet && isLoggedIn)
  const [bookState, runBookAction, isBookingPending] = useActionState<BookState, FormData>(
    async (_prev, formData) => bookAppointment(formData),
    { ok: false }
  )

  const [addPetState, runAddPetAction, isAddPetPending] = useActionState<AddPetState, FormData>(
    async (_prev, formData) => addPetAction(formData),
    { ok: false }
  )

  useEffect(() => {
    if (!isLoggedIn) return
    if (pets.length > 0) {
      setShowAddPet(false)
      return
    }
    setShowAddPet(true)
  }, [isLoggedIn, pets.length])

  useEffect(() => {
    if (!bookState?.ok) return
    toast.success('Wizyta umówiona pomyślnie!')
    setSelectedPet('')
    setSelectedTime(null)
    setSelectedDate(undefined)
    setSelectedService(null)
  }, [bookState?.ok])

  useEffect(() => {
    setSelectedTime(null)
  }, [selectedDate, selectedService?.id])

  const busyIntervals = useMemo(() => {
    return (busyAppointments ?? [])
      .map((a) => {
        const start = new Date(a.start_time)
        const end = new Date(a.end_time)
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null
        return { start, end }
      })
      .filter(Boolean) as Array<{ start: Date; end: Date }>
  }, [busyAppointments])

  const disabledTimes = useMemo(() => {
    if (!selectedDate) return new Set<string>()
    const y = selectedDate.getFullYear()
    const m = selectedDate.getMonth()
    const d = selectedDate.getDate()
    const set = new Set<string>()
    for (const time of timeSlots) {
      const [hh, mm] = time.split(':').map((v) => Number.parseInt(v, 10))
      if (!Number.isFinite(hh) || !Number.isFinite(mm)) continue
      const slotStart = new Date(y, m, d, hh, mm, 0, 0)
      if (Number.isNaN(slotStart.getTime())) continue
      const collides = busyIntervals.some((it) => {
        if (slotStart.getTime() === it.end.getTime()) return false
        return isWithinInterval(slotStart, { start: it.start, end: it.end })
      })
      if (collides) set.add(time)
    }
    return set
  }, [busyIntervals, selectedDate])

  useEffect(() => {
    if (!bookState?.error) return
    toast.error(bookState.error)
  }, [bookState?.error])

  useEffect(() => {
    if (!addPetState?.ok || !addPetState.petId) return
    toast.success('Twój pupil został dodany!')
    setSelectedPet(addPetState.petId)
    setShowAddPet(false)
    setNewPetSpecies('')
    router.refresh()
  }, [addPetState?.ok, addPetState?.petId, router])

  useEffect(() => {
    if (!addPetState?.error) return
    toast.error(addPetState.error)
  }, [addPetState?.error])

  return (
    <div className="min-h-screen bg-stone-50">
      <main>
        <ClinicHeader
          name={clinic.name}
          address={clinic.address}
          city={clinic.city}
          phone={clinic.phone}
          logoUrl={clinic.logo_url}
        />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-5 lg:gap-8">
            <div className="lg:col-span-3">
              <Tabs defaultValue="uslugi" className="w-full">
                <TabsList className="mb-6 w-full justify-start bg-white p-1">
                  <TabsTrigger value="onas" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                    O nas
                  </TabsTrigger>
                  <TabsTrigger value="uslugi" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                    Usługi i Cennik
                  </TabsTrigger>
                  <TabsTrigger value="opinie" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                    Opinie
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="onas">
                  <AboutSection clinic={clinic} serviceCount={services.length} photos={photos} />
                </TabsContent>

                <TabsContent value="uslugi">
                  <ServicesList services={services} selectedService={selectedService} onServiceSelect={setSelectedService} />
                </TabsContent>

                <TabsContent value="opinie">
                  <ReviewsSection reviews={reviews} clinicId={clinic.id} isLoggedIn={isLoggedIn} canReview={canReview} />
                </TabsContent>
              </Tabs>
            </div>

            <div className="hidden lg:col-span-2 lg:block">
              <div className="sticky top-24">
                <div className="rounded-2xl bg-white p-6 shadow-xl">
                  <h2 className="mb-6 text-xl font-bold text-stone-800">
                    Umów wizytę online
                  </h2>

                    <div className="space-y-6">

                    <div>
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-600">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">1</span>
                        Wybrana usługa
                      </div>
                      {selectedService ? (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-stone-800">{selectedService.name}</p>
                              <p className="text-sm text-stone-500">{selectedService.duration} • {selectedService.price}</p>
                            </div>
                            <Check className="h-5 w-5 text-emerald-600" />
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-3 text-center text-sm text-stone-500">
                          Wybierz usługę z listy
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-600">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">2</span>
                        Wybierz dzień
                      </div>
                      <div className="rounded-lg border border-stone-200 bg-stone-50 p-2">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date() || date.getDay() === 0}
                          className="mx-auto"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-600">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">3</span>
                        Wybierz godzinę
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            disabled={!selectedDate || disabledTimes.has(time)}
                            onClick={() => {
                              if (!selectedDate) return
                              if (disabledTimes.has(time)) return
                              setSelectedTime(time)
                            }}
                            className={`rounded-full px-3 py-2 text-sm font-medium transition-all ${
                              selectedTime === time
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-100 text-stone-700 hover:bg-emerald-100 hover:text-emerald-700'
                            } ${!selectedDate || disabledTimes.has(time) ? 'opacity-50 cursor-not-allowed hover:bg-stone-100 hover:text-stone-700' : ''}`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-600">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">4</span>
                        Wybierz zwierzaka
                      </div>
                      {!isLoggedIn ? (
                        <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-3 text-center text-sm text-stone-500">
                          Zaloguj się, aby wybrać pacjenta
                        </div>
                      ) : pets.length > 0 ? (
                        <Select value={selectedPet} onValueChange={setSelectedPet}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Wybierz swojego pupila" />
                          </SelectTrigger>
                          <SelectContent>
                            {pets.map((pet) => (
                              <SelectItem key={pet.id} value={pet.id}>
                                <span className="flex items-center gap-2">
                                  <span>{pet.name}</span>
                                  <span className="text-stone-400">({pet.species})</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="space-y-3">
                          <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4">
                            <p className="text-sm font-medium text-stone-700">Brak zwierzaków</p>
                            <p className="mt-1 text-sm text-stone-500">Dodaj pacjenta, aby dokończyć rezerwację.</p>
                            <Button
                              type="button"
                              variant="outline"
                              className="mt-3 w-full border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                              onClick={() => setShowAddPet((v) => !v)}
                            >
                              Dodaj swojego pierwszego zwierzaka
                            </Button>
                          </div>

                          <div className={`overflow-hidden transition-all duration-300 ${showAddPet ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="max-h-[520px] overflow-y-auto rounded-lg border border-stone-200 bg-white p-4">
                              <form action={runAddPetAction} className="space-y-3">
                                <input type="hidden" name="clinicId" value={clinic.id} />
                                <div>
                                  <label className="text-xs font-medium uppercase tracking-wide text-stone-500">Imię</label>
                                  <input
                                    name="name"
                                    className="mt-1 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700 outline-none focus:border-emerald-300 focus:bg-white"
                                    placeholder="Np. Reksio"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="text-xs font-medium uppercase tracking-wide text-stone-500">Gatunek</label>
                                  <Select value={newPetSpecies} onValueChange={setNewPetSpecies}>
                                    <SelectTrigger className="mt-1 w-full">
                                      <SelectValue placeholder="Wybierz gatunek" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Pies">Pies</SelectItem>
                                      <SelectItem value="Kot">Kot</SelectItem>
                                      <SelectItem value="Inne">Inne</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <input type="hidden" name="species" value={newPetSpecies} />
                                </div>

                                <div>
                                  <label className="text-xs font-medium uppercase tracking-wide text-stone-500">Rasa (opcjonalnie)</label>
                                  <input
                                    name="breed"
                                    className="mt-1 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700 outline-none focus:border-emerald-300 focus:bg-white"
                                    placeholder="Np. Labrador"
                                  />
                                </div>

                                <div>
                                  <label className="text-xs font-medium uppercase tracking-wide text-stone-500">Wiek</label>
                                  <input
                                    name="age"
                                    type="number"
                                    min={0}
                                    className="mt-1 w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700 outline-none focus:border-emerald-300 focus:bg-white"
                                    placeholder="Np. 3"
                                  />
                                </div>

                                <Button
                                  type="submit"
                                  disabled={isAddPetPending}
                                  className="w-full bg-emerald-600 py-5 text-sm font-semibold hover:bg-emerald-700"
                                >
                                  Zapisz i kontynuuj
                                </Button>
                              </form>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <form action={runBookAction} className="space-y-3">
                      <input type="hidden" name="clinicId" value={clinic.id} />
                      <input type="hidden" name="serviceId" value={selectedService?.id ?? ''} />
                      <input type="hidden" name="petId" value={selectedPet} />
                      <input type="hidden" name="date" value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ''} />
                      <input type="hidden" name="time" value={selectedTime ?? ''} />

                      <Button className="w-full bg-emerald-600 py-6 text-base font-semibold hover:bg-emerald-700" disabled={!isBookingComplete || isBookingPending} type="submit">
                        Potwierdź rezerwację
                      </Button>

                      {isBookingComplete && (
                        <p className="text-center text-sm text-stone-500">
                          Potwierdzenie otrzymasz na e-mail
                        </p>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileBookingDrawer
        selectedService={selectedService}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedPet={selectedPet}
        timeSlots={timeSlots}
        disabledTimes={disabledTimes}
        pets={pets}
        isLoggedIn={isLoggedIn}
        bookingOk={Boolean(bookState?.ok)}
        onBook={runBookAction}
        onDateSelect={setSelectedDate}
        onTimeSelect={setSelectedTime}
        onPetSelect={setSelectedPet}
      />
    </div>
  )
}

