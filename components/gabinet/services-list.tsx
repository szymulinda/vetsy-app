'use client'

import { Clock, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Service {
  id: string
  name: string
  category: string | null
  duration: string
  price: string
}

interface ServicesListProps {
  services: Service[]
  selectedService: Service | null
  onServiceSelect: (service: Service) => void
}

export function ServicesList({ services, selectedService, onServiceSelect }: ServicesListProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold tracking-[-0.01em] text-stone-800">Nasze usługi</h2>
        <p className="mt-3 mb-6 text-sm text-stone-500">
          Wybierz usługę, aby zarezerwować wizytę. Wszystkie ceny są orientacyjne i mogą się różnić w zależności od stanu zdrowia zwierzęcia.
        </p>
        
        <div className="divide-y divide-stone-100">
          {services.map((service) => {
            const isSelected = selectedService?.id === service.id
            return (
              <div
                key={service.id}
                className={`flex flex-col gap-3 py-4 transition-colors first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between ${
                  isSelected ? 'bg-emerald-50/50 -mx-4 px-4 rounded-lg' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-stone-800">{service.name}</h3>
                    {service.category?.trim() ? (
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                        {service.category.trim()}
                      </span>
                    ) : null}
                    {isSelected && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Wybrano
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-sm text-stone-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {service.duration}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold tracking-[-0.01em] text-emerald-700">{service.price}</span>
                  <Button
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() => onServiceSelect(service)}
                    className={
                      isSelected
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'border-emerald-600 text-emerald-700 hover:bg-emerald-50'
                    }
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-4 w-4" />
                        Wybrano
                      </>
                    ) : (
                      'Wybierz'
                    )}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
