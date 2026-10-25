'use client'

import { useEffect, useState } from 'react'
import { CalendarIcon, ChevronUp, Check, X, Cat, Dog, PawPrint } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Database } from '@/lib/supabase/database.types'

interface Service {
  id: string
  name: string
  category?: string | null
  duration: string
  price: string
}

type PetPick = Pick<
  Database['public']['Tables']['pets']['Row'],
  'id' | 'name' | 'species'
>

interface MobileBookingDrawerProps {
  selectedService: Service | null
  selectedDate: Date | undefined
  selectedTime: string | null
  selectedPet: string
  timeSlots: string[]
  disabledTimes: Set<string>
  pets: PetPick[]
  isLoggedIn: boolean
  bookingOk: boolean
  onBook: (payload: FormData) => void
  onDateSelect: (date: Date | undefined) => void
  onTimeSelect: (time: string) => void
  onPetSelect: (petId: string) => void
}

export function MobileBookingDrawer({
  selectedService,
  selectedDate,
  selectedTime,
  selectedPet,
  timeSlots,
  disabledTimes,
  pets,
  isLoggedIn,
  bookingOk,
  onBook,
  onDateSelect,
  onTimeSelect,
  onPetSelect,
}: MobileBookingDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const isBookingComplete = Boolean(selectedService && selectedDate && selectedTime && selectedPet && isLoggedIn)
  
  const completedSteps = [
    selectedService,
    selectedDate,
    selectedTime,
    selectedPet,
  ].filter(Boolean).length

  useEffect(() => {
    if (!bookingOk) return
    setIsOpen(false)
  }, [bookingOk])

  function petIcon(species: string) {
    const s = species.trim().toLowerCase()
    if (s.includes('kot')) return Cat
    if (s.includes('pies')) return Dog
    return PawPrint
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <button className="flex w-full items-center justify-between bg-white px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <CalendarIcon className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-stone-800">Umów wizytę</p>
                <p className="text-xs text-stone-500">
                  {selectedService ? selectedService.name : 'Wybierz usługę'}
                  {selectedService && ` • ${selectedService.price}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                {completedSteps}/4
              </span>
              <ChevronUp className="h-5 w-5 text-stone-400" />
            </div>
          </button>
        </DrawerTrigger>
        
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-b border-stone-100">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-lg font-bold text-stone-800">
                Umów wizytę online
              </DrawerTitle>
              <DrawerClose asChild>
                <button className="rounded-full p-2 hover:bg-stone-100">
                  <X className="h-5 w-5 text-stone-500" />
                </button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          
          <div className="overflow-y-auto p-4">
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
                    Wybierz usługę z listy powyżej
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
                    onSelect={onDateSelect}
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
                        onTimeSelect(time)
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
                  <Select value={selectedPet} onValueChange={onPetSelect} disabled={!isLoggedIn || pets.length === 0}>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          !isLoggedIn
                            ? 'Zaloguj się, aby wybrać pacjenta'
                            : pets.length === 0
                              ? 'Brak pacjentów na koncie'
                              : 'Wybierz swojego pupila'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {pets.map((pet) => {
                        const Icon = petIcon(pet.species)
                        return (
                          <SelectItem key={pet.id} value={pet.id}>
                            <span className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-emerald-600" />
                              <span>{pet.name}</span>
                              <span className="text-stone-400">({pet.species})</span>
                            </span>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
              </div>
              
                <form
                  action={(fd) => onBook(fd)}
                >
                  <input type="hidden" name="serviceId" value={selectedService?.id ?? ''} />
                  <input type="hidden" name="petId" value={selectedPet} />
                  <input
                    type="hidden"
                    name="date"
                    value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ''}
                  />
                  <input type="hidden" name="time" value={selectedTime ?? ''} />
                  <Button
                    className="w-full bg-emerald-600 py-6 text-base font-semibold hover:bg-emerald-700"
                    disabled={!isBookingComplete}
                    type="submit"
                  >
                    Potwierdź rezerwację
                  </Button>
                </form>
              
              {isBookingComplete && (
                <p className="text-center text-sm text-stone-500">
                  Potwierdzenie otrzymasz na e-mail
                </p>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
